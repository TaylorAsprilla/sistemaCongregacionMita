import { Component, ElementRef, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { forkJoin } from 'rxjs';
import { InformeService } from 'src/app/services/informe/informe.service';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import { MetaService } from 'src/app/services/meta/meta.service';
import { VisitaService } from 'src/app/services/visita/visita.service';
import { SituacionVisitaService } from 'src/app/services/situacion-visita/situacion-visita.service';
import { LogroService } from 'src/app/services/logro/logro.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import { ContabilidadModel } from 'src/app/core/models/contabilidad.model';
import { VisitaModel } from 'src/app/core/models/visita.model';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';
import { LogroModel } from 'src/app/core/models/logro.model';
import { MetaModel } from 'src/app/core/models/meta.model';
import { ActividadModel } from 'src/app/core/models/actividad.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-ver-informe',
  templateUrl: './ver-informe.component.html',
  styleUrls: ['./ver-informe.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class VerInformeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private usuarioService = inject(UsuarioService);
  private congregacionService = inject(CongregacionService);
  private tipoActividadService = inject(TipoActividadService);
  private informeService = inject(InformeService);
  private actividadService = inject(ActividadService);
  private contabilidadService = inject(ContabilidadService);
  private metaService = inject(MetaService);
  private visitaService = inject(VisitaService);
  private situacionVisitaService = inject(SituacionVisitaService);
  private logroService = inject(LogroService);
  private router = inject(Router);

  @ViewChild('content', { static: false }) content!: ElementRef;

  cargando: boolean = false;
  descargandoPDF: boolean = false;

  // Información del usuario
  nombreUsuario: string = '';
  fechaActual: Date = new Date();
  congregacionPais: string = 'N/A';
  congregacionCiudad: string = 'N/A';
  congregacionCampo: string = 'N/A';

  // Información del trimestre
  trimestre: string = '';
  numeroTrimestre: number = 1;
  anioTrimestre: number = new Date().getFullYear();

  // Datos del informe
  actividades: ActividadModel[] = [];
  contabilidad: ContabilidadModel[] = [];
  metas: MetaModel[] = [];
  visitas: VisitaModel[] = [];
  situacionVisitas: SituacionVisitaModel[] = [];
  logros: LogroModel[] = [];
  tiposActividad: TipoActividadModel[] = [];

  ngOnInit(): void {
    this.nombreUsuario = this.usuarioService.usuarioNombre || '';
    this.cargarInformacionCongregacion();
    this.cargarTiposActividad();
    this.calcularTrimestre();
    this.verificarYCargarInforme();
  }

  /**
   * Carga la información de congregación del usuario
   */
  private cargarInformacionCongregacion(): void {
    const usuarioId = this.usuarioService.usuarioId;

    // Cargar congregaciones y buscar donde el usuario es obrero encargado
    this.congregacionService
      .getCongregaciones()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (congregaciones: CongregacionModel[]) => {
          // Buscar congregaciones donde el usuario es obrero encargado o obrero encargado dos
          const congregacionesDelUsuario = congregaciones.filter(
            (cong) => cong.idObreroEncargado === usuarioId || cong.idObreroEncargadoDos === usuarioId,
          );

          if (congregacionesDelUsuario.length > 0) {
            // Tomar la primera congregación encontrada
            const congregacion = congregacionesDelUsuario[0];

            // Obtener información adicional de país, ciudad y campo desde el usuario
            try {
              // País
              if (this.usuarioService.usuario?.usuarioCongregacionPais?.[0]?.pais) {
                this.congregacionPais = this.usuarioService.usuario.usuarioCongregacionPais[0].pais;
              }

              // Ciudad/Congregación - usar el nombre de la congregación donde es obrero encargado
              this.congregacionCiudad = congregacion.congregacion;

              // Campo
              if (this.usuarioService.usuario?.usuarioCongregacionCampo?.[0]?.campo) {
                this.congregacionCampo = this.usuarioService.usuario.usuarioCongregacionCampo[0].campo;
              }
            } catch (error) {
              console.warn('Error al cargar información adicional de congregación:', error);
            }
          } else {
            // Si no es obrero encargado, mantener valores por defecto 'N/A'
            console.warn('El usuario no es obrero encargado de ninguna congregación');
          }
        },
        error: (error) => {
          console.error('Error al cargar congregaciones:', error);
        },
      });
  }

  /**
   * Carga los tipos de actividad
   */
  private cargarTiposActividad(): void {
    this.tipoActividadService
      .getTipoActividad()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tipos: TipoActividadModel[]) => {
          this.tiposActividad = tipos;
        },
        error: (error) => {
          console.error('Error al cargar tipos de actividad:', error);
        },
      });
  }

  /**
   * Busca el nombre del tipo de actividad por ID
   */
  buscarNombreTipoActividad(idTipoActividad: number): string {
    const tipo = this.tiposActividad.find((t) => t.id === idTipoActividad);
    return tipo?.nombre || 'N/A';
  }

  /**
   * Calcula el trimestre actual y sus meses
   */
  private calcularTrimestre(): void {
    const mesActual = new Date().getMonth(); // 0-11
    this.numeroTrimestre = Math.floor(mesActual / 3) + 1;

    switch (this.numeroTrimestre) {
      case 1:
        this.trimestre = 'Enero, Febrero y Marzo';
        break;
      case 2:
        this.trimestre = 'Abril, Mayo y Junio';
        break;
      case 3:
        this.trimestre = 'Julio, Agosto y Septiembre';
        break;
      case 4:
        this.trimestre = 'Octubre, Noviembre y Diciembre';
        break;
    }
  }

  /**
   * Verifica si hay un informe activo y carga sus datos
   */
  private verificarYCargarInforme(): void {
    const informeId = this.informeService.informeActivoId;

    if (!informeId) {
      Swal.fire({
        title: 'Sin informe activo',
        text: 'No hay un informe activo. Por favor, genera un informe primero.',
        icon: 'warning',
        confirmButtonText: 'Ir a Informes',
      }).then(() => {
        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
      });
      return;
    }

    this.cargarDatosInforme(informeId);
  }

  /**
   * Carga todos los datos del informe en paralelo
   */
  private cargarDatosInforme(informeId: number): void {
    this.cargando = true;

    forkJoin({
      actividades: this.actividadService.getActividad(),
      contabilidad: this.contabilidadService.getContabilidad(),
      metas: this.metaService.getMetas(),
      visitas: this.visitaService.getVisita(),
      situacionVisitas: this.situacionVisitaService.getSituacionVisitas(),
      logros: this.logroService.getLogros(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {
          // Filtrar datos por informe_id
          this.actividades = (datos.actividades || []).filter((a: any) => Number(a.informe_id) === Number(informeId));
          this.contabilidad = (datos.contabilidad || []).filter((c: any) => Number(c.informe_id) === Number(informeId));
          this.metas = (datos.metas || []).filter((m: any) => Number(m.informe_id) === Number(informeId));
          this.visitas = (datos.visitas || []).filter((v: any) => Number(v.informe_id) === Number(informeId));
          this.situacionVisitas = (datos.situacionVisitas || []).filter(
            (s: any) => Number(s.informe_id) === Number(informeId),
          );
          this.logros = (datos.logros || []).filter((l: any) => Number(l.informe_id) === Number(informeId));

          this.cargando = false;
        },
        error: (error) => {
          this.cargando = false;
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los datos del informe',
            icon: 'error',
          });
        },
      });
  }

  /**
   * Obtiene el ordinal del trimestre (1er, 2do, 3er, 4to)
   */
  getOrdinalTrimestre(): string {
    switch (this.numeroTrimestre) {
      case 1:
        return '1er';
      case 2:
        return '2do';
      case 3:
        return '3er';
      case 4:
        return '4to';
      default:
        return '';
    }
  }

  /**
   * Descarga el informe como PDF
   */
  async descargarPDF(): Promise<void> {
    if (!this.content) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo generar el PDF',
        icon: 'error',
      });
      return;
    }

    this.descargandoPDF = true;

    try {
      const element = this.content.nativeElement;

      // Generar canvas del contenido
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Descargar PDF
      pdf.save(`Informe_${this.getOrdinalTrimestre()}_Trimestre_${this.anioTrimestre}.pdf`);

      this.descargandoPDF = false;

      Swal.fire({
        title: 'Éxito',
        text: 'El informe se ha descargado correctamente',
        icon: 'success',
        timer: 2000,
      });
    } catch (error) {
      this.descargandoPDF = false;
      Swal.fire({
        title: 'Error',
        text: 'No se pudo generar el PDF. Intente nuevamente.',
        icon: 'error',
      });
    }
  }

  /**
   * Navega de regreso a la página de informe
   */
  volverAlInforme(): void {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }

  /**
   * Calcula el total de una propiedad numérica en un array
   */
  calcularTotal(items: any[], propiedad: string): number {
    return items.reduce((total, item) => total + (Number(item[propiedad]) || 0), 0);
  }
}
