import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { InformeService } from 'src/app/services/informe/informe.service';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { ActividadEconomicaService } from 'src/app/services/actividad-economica/actividad-economica.service';
import { MetaService } from 'src/app/services/meta/meta.service';
import { VisitaService } from 'src/app/services/visita/visita.service';
import { SituacionVisitaService } from 'src/app/services/situacion-visita/situacion-visita.service';
import { LogroService } from 'src/app/services/logro/logro.service';
import { DiezmoService } from 'src/app/services/diezmo/diezmo.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import { TipoActividadEconomicaService } from 'src/app/services/tipo-actividad-economica/tipo-actividad-economica.service';
import { VisitaModel } from 'src/app/core/models/visita.model';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';
import { LogroModel } from 'src/app/core/models/logro.model';
import { MetaModel } from 'src/app/core/models/meta.model';
import { ActividadModel } from 'src/app/core/models/actividad.model';
import { ActividadEconomicaModel } from 'src/app/core/models/actividad-economica.model';
import { DiezmoModel } from 'src/app/core/models/diezmo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import { TipoActividadEconomicaModel } from 'src/app/core/models/tipo-actividad-economica.model';
import Swal from 'sweetalert2';
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
  private tipoActividadEconomicaService = inject(TipoActividadEconomicaService);
  private informeService = inject(InformeService);
  private actividadService = inject(ActividadService);
  private actividadEconomicaService = inject(ActividadEconomicaService);
  private metaService = inject(MetaService);
  private visitaService = inject(VisitaService);
  private situacionVisitaService = inject(SituacionVisitaService);
  private logroService = inject(LogroService);
  private diezmoService = inject(DiezmoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cargando: boolean = false;
  descargandoPDF: boolean = false;
  informeIdParam: number | null = null;

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
  actividadesEclesiasticas: ActividadModel[] = [];
  actividadesEconomicas: ActividadEconomicaModel[] = [];
  metas: MetaModel[] = [];
  visitas: VisitaModel[] = [];
  situacionVisitas: SituacionVisitaModel[] = [];
  logros: LogroModel[] = [];
  diezmos: DiezmoModel[] = [];
  tiposActividad: TipoActividadModel[] = [];
  tiposActividadEconomica: TipoActividadEconomicaModel[] = [];

  ngOnInit(): void {
    // Verificar si viene un ID de informe por parámetro de ruta
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params['id']) {
        this.informeIdParam = Number(params['id']);
      }
    });

    this.nombreUsuario = this.usuarioService.usuarioNombre || '';
    this.cargarInformacionCongregacion();
    this.cargarTiposActividad();
    this.cargarTiposActividadEconomica();
    this.calcularTrimestre();
    this.verificarYCargarInforme();
  }

  /**
   * Carga la información de congregación del usuario
   */
  private cargarInformacionCongregacion(usuarioIdParam?: number): void {
    const usuarioId = usuarioIdParam || this.usuarioService.usuarioId;

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
   * Carga los tipos de actividad económica
   */
  private cargarTiposActividadEconomica(): void {
    this.tipoActividadEconomicaService
      .getTipoActividadEconomica()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tipos: TipoActividadEconomicaModel[]) => {
          this.tiposActividadEconomica = tipos;
        },
        error: (error) => {
          console.error('Error al cargar tipos de actividad económica:', error);
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
    // Si viene un ID por parámetro, usar ese
    let informeId = this.informeIdParam;

    // Si no viene por parámetro, usar el informe activo del usuario
    if (!informeId) {
      informeId = this.informeService.informeActivoId;
    }

    // Si no hay informeId disponible, intentar cargar desde API
    if (!informeId) {
      this.intentarCargarInformeActivo();
      return;
    }

    // Si viene por parámetro, primero cargar info básica del informe para obtener el usuario
    if (this.informeIdParam) {
      // Intentar obtener datos del state (si viene desde la lista)
      const navigation = this.router.getCurrentNavigation();
      const informeState = navigation?.extras?.state || history.state;

      if (informeState?.informeData && informeState?.fromListaPais) {
        const informeData = informeState.informeData;

        // Cargar información del usuario del informe
        this.cargarInformacionUsuarioInforme(informeData.usuario_id);
        this.cargarDatosInforme(informeId);
      } else {
        // Fallback: intentar cargar desde API
        this.informeService
          .getInforme(informeId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (informe: any) => {
              if (informe && informe[0]) {
                const informeData = informe[0];
                // Cargar información del usuario del informe
                this.cargarInformacionUsuarioInforme(informeData.usuario_id);
                this.cargarDatosInforme(informeId);
              } else {
                console.error('❌ No se encontró el informe');
                Swal.fire({
                  title: 'Error',
                  text: 'No se encontró el informe solicitado.',
                  icon: 'error',
                });
              }
            },
            error: (error) => {
              console.error('❌ Error al cargar informe:', error);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar el informe.',
                icon: 'error',
              });
            },
          });
      }
    } else {
      this.cargarDatosInforme(informeId);
    }
  }

  /**
   * Intenta cargar el informe activo del usuario desde la API
   */
  private intentarCargarInformeActivo(): void {
    const usuarioId = this.usuarioService.usuario?.id;

    if (!usuarioId) {
      console.error('❌ No hay usuario autenticado');
      this.mostrarErrorSinInforme();
      return;
    }

    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();

    this.cargando = true;
    this.informeService
      .cargarInformeActivo(usuarioId, fechaInicio, fechaFin)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.cargando = false;

          if (response.tieneInformeAbierto && this.informeService.informeActivo) {
            // Ahora sí cargar los datos del informe
            this.cargarDatosInforme(this.informeService.informeActivo.id);
          } else {
            console.warn('⚠️ No se encontró informe activo');
            this.mostrarErrorSinInforme();
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar informe activo:', error);
          this.cargando = false;
          this.mostrarErrorSinInforme();
        },
      });
  }

  /**
   * Muestra el mensaje de error cuando no hay informe activo
   */
  private mostrarErrorSinInforme(): void {
    Swal.fire({
      title: 'Sin informe activo',
      text: 'No hay un informe activo. Por favor, genera un informe primero.',
      icon: 'warning',
      confirmButtonText: 'Ir a Informes',
    }).then(() => {
      this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
    });
  }

  /**
   * Obtiene las fechas de inicio y fin del trimestre actual
   */
  private obtenerFechasTrimestreActual(): { fechaInicio: string; fechaFin: string } {
    const año = this.anioTrimestre;
    let mesInicio: number;
    let mesFin: number;

    switch (this.numeroTrimestre) {
      case 1:
        mesInicio = 0; // Enero
        mesFin = 2; // Marzo
        break;
      case 2:
        mesInicio = 3; // Abril
        mesFin = 5; // Junio
        break;
      case 3:
        mesInicio = 6; // Julio
        mesFin = 8; // Septiembre
        break;
      case 4:
        mesInicio = 9; // Octubre
        mesFin = 11; // Diciembre
        break;
      default:
        mesInicio = 0;
        mesFin = 2;
    }

    const fechaInicio = new Date(año, mesInicio, 1);
    const fechaFin = new Date(año, mesFin + 1, 0); // Último día del mes final

    return {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    };
  }

  /**
   * Carga información del usuario propietario del informe
   */
  private cargarInformacionUsuarioInforme(usuarioId: number): void {
    this.usuarioService
      .getUsuario(usuarioId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.ok && response.usuario) {
            const usuario = response.usuario;
            // Actualizar nombre del usuario
            this.nombreUsuario =
              `${usuario.primerNombre || ''} ${usuario.segundoNombre || ''} ${usuario.primerApellido || ''} ${usuario.segundoApellido || ''}`.trim();

            // Actualizar información de congregación
            if (usuario.usuarioCongregacionPais?.[0]) {
              this.congregacionPais = usuario.usuarioCongregacionPais[0].pais || 'N/A';
            }
            if (usuario.usuarioCongregacion?.[0]?.UsuarioCongregacion?.CongregacionModel) {
              this.congregacionCiudad =
                usuario.usuarioCongregacion[0].UsuarioCongregacion.CongregacionModel.congregacion || 'N/A';
            }
            if (usuario.usuarioCampo?.[0]?.UsuarioCampo?.CampoModel) {
              this.congregacionCampo = usuario.usuarioCampo[0].UsuarioCampo.CampoModel.campo || 'N/A';
            }
          }
        },
        error: (error) => {
          console.error('Error al cargar usuario del informe:', error);
          // Continuar con valores por defecto
        },
      });
  }

  /**
   * Carga todos los datos del informe en paralelo
   */
  private cargarDatosInforme(informeId: number): void {
    this.cargando = true;

    forkJoin({
      actividades: this.actividadService.getActividad(),
      actividadesEconomicas: this.actividadEconomicaService.getActividadEconomica(),
      metas: this.metaService.getMetas(),
      visitas: this.visitaService.getVisita(),
      situacionVisitas: this.situacionVisitaService.getSituacionVisitas(),
      logros: this.logroService.getLogros(),
      diezmos: this.diezmoService.getDiezmos(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {
          // Filtrar datos por informe_id y estado activo
          this.actividades = (datos.actividades || []).filter(
            (a: any) => Number(a.informe_id) === Number(informeId) && a.estado !== false,
          );
          this.actividadesEclesiasticas = this.actividades;

          this.actividadesEconomicas = (datos.actividadesEconomicas || []).filter(
            (a: any) => Number(a.informe_id) === Number(informeId) && a.estado !== false,
          );

          this.metas = (datos.metas || []).filter(
            (m: any) => Number(m.informe_id) === Number(informeId) && m.estado !== false,
          );
          this.visitas = (datos.visitas || []).filter(
            (v: any) => Number(v.informe_id) === Number(informeId) && v.estado !== false,
          );
          this.situacionVisitas = (datos.situacionVisitas || []).filter(
            (s: any) => Number(s.informe_id) === Number(informeId) && s.estado !== false,
          );
          this.logros = (datos.logros || []).filter(
            (l: any) => Number(l.informe_id) === Number(informeId) && l.estado !== false,
          );
          this.diezmos = (datos.diezmos || []).filter(
            (d: any) => Number(d.informe_id) === Number(informeId) && d.estado !== false,
          );

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
   * Descarga el informe como PDF usando pdfmake
   */
  descargarPDF(): void {
    this.descargandoPDF = true;

    try {
      // Definir el documento PDF
      const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          // Encabezado principal con mejor diseño
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 515,
                h: 120,
                r: 5,
                lineColor: '#3498db',
                lineWidth: 2,
              },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            text: 'INFORME TRIMESTRAL',
            style: 'header',
            alignment: 'center',
            margin: [0, -110, 0, 15],
          },
          {
            text: `${this.getOrdinalTrimestre()} Trimestre ${this.anioTrimestre}`,
            style: 'subheader',
            alignment: 'center',
            margin: [0, 0, 0, 8],
          },
          {
            text: this.trimestre,
            style: 'trimestre',
            alignment: 'center',
            margin: [0, 0, 0, 25],
          },

          // Información del usuario y congregación con mejor formato
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { text: 'Obrero:', style: 'infoLabel', border: [false, false, false, false] },
                  { text: this.nombreUsuario, style: 'infoValue', border: [false, false, false, false] },
                ],
                [
                  { text: 'Fecha:', style: 'infoLabel', border: [false, false, false, false] },
                  {
                    text: this.fechaActual.toLocaleDateString(),
                    style: 'infoValue',
                    border: [false, false, false, false],
                  },
                ],
                [
                  { text: 'País:', style: 'infoLabel', border: [false, false, false, false] },
                  { text: this.congregacionPais, style: 'infoValue', border: [false, false, false, false] },
                ],
                [
                  { text: 'Campo:', style: 'infoLabel', border: [false, false, false, false] },
                  { text: this.congregacionCampo, style: 'infoValue', border: [false, false, false, false] },
                ],
                [
                  { text: 'Congregación:', style: 'infoLabel', border: [false, false, false, false] },
                  { text: this.congregacionCiudad, style: 'infoValue', border: [false, false, false, false] },
                ],
              ],
            },
            margin: [40, 10, 40, 30],
          },

          // A. ACTIVIDADES ECLESIÁSTICAS
          { text: 'A. ACTIVIDADES ECLESIÁSTICAS', style: 'sectionTitle', pageBreak: 'before' },
          this.actividadesEclesiasticas.length > 0
            ? this.crearTablaActividades()
            : { text: 'No hay actividades eclesiásticas registradas.', style: 'noData' },

          // B. ACTIVIDADES ECONÓMICAS
          { text: 'B. ACTIVIDADES ECONÓMICAS', style: 'sectionTitle', margin: [0, 20, 0, 10] },
          this.actividadesEconomicas.length > 0
            ? this.crearTablaActividadesEconomicas()
            : { text: 'No hay actividades económicas registradas.', style: 'noData' },

          // C. RESUMEN DE VISITAS REALIZADAS
          { text: 'C. RESUMEN DE VISITAS REALIZADAS', style: 'sectionTitle', margin: [0, 20, 0, 10] },
          this.visitas.length > 0 ? this.crearTablaVisitas() : { text: 'No hay visitas registradas.', style: 'noData' },

          // D. RESUMEN DE DIEZMOS
          { text: 'D. RESUMEN DE DIEZMOS', style: 'sectionTitle', margin: [0, 20, 0, 10] },
          this.diezmos.length > 0 ? this.crearTablaDiezmos() : { text: 'No hay diezmos registrados.', style: 'noData' },

          // E. SITUACIONES ENCONTRADAS DURANTE LAS VISITAS
          {
            text: 'E. SITUACIONES ENCONTRADAS DURANTE LAS VISITAS',
            style: 'sectionTitle',
            margin: [0, 20, 0, 10],
            pageBreak: 'before',
          },
          this.situacionVisitas.length > 0
            ? this.crearTablaSituaciones()
            : { text: 'No hay situaciones registradas.', style: 'noData' },

          // F. LOGROS OBTENIDOS
          { text: 'F. LOGROS OBTENIDOS', style: 'sectionTitle', margin: [0, 20, 0, 10] },
          this.logros.length > 0 ? this.crearTablaLogros() : { text: 'No hay logros registrados.', style: 'noData' },

          // G. METAS PARA EL PRÓXIMO TRIMESTRE
          { text: 'G. METAS PARA EL PRÓXIMO TRIMESTRE', style: 'sectionTitle', margin: [0, 20, 0, 10] },
          this.metas.length > 0 ? this.crearTablaMetas() : { text: 'No hay metas registradas.', style: 'noData' },
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            color: '#2c3e50',
          },
          subheader: {
            fontSize: 16,
            bold: true,
            color: '#2980b9',
          },
          trimestre: {
            fontSize: 13,
            color: '#7f8c8d',
            italics: true,
          },
          infoLabel: {
            fontSize: 11,
            bold: true,
            color: '#34495e',
          },
          infoValue: {
            fontSize: 11,
            color: '#2c3e50',
          },
          info: {
            fontSize: 11,
            color: '#7f8c8d',
          },
          sectionTitle: {
            fontSize: 14,
            bold: true,
            color: '#2980b9',
            margin: [0, 10, 0, 10],
          },
          tableHeader: {
            bold: true,
            fontSize: 11,
            color: '#ffffff',
            fillColor: '#3498db',
          },
          tableCell: {
            fontSize: 10,
          },
          noData: {
            fontSize: 10,
            italics: true,
            color: '#95a5a6',
            margin: [0, 5, 0, 15],
          },
        },
        defaultStyle: {
          fontSize: 10,
        },
      };

      // Inicializar fuentes de pdfmake si aún no están configuradas
      if (!(pdfMake as any).vfs) {
        (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || pdfFonts;
      }

      // Generar y descargar el PDF
      pdfMake
        .createPdf(docDefinition)
        .download(`Informe_${this.getOrdinalTrimestre()}_Trimestre_${this.anioTrimestre}.pdf`);

      this.descargandoPDF = false;

      Swal.fire({
        title: 'Éxito',
        text: 'El informe se ha descargado correctamente',
        icon: 'success',
        timer: 2000,
      });
    } catch (error) {
      this.descargandoPDF = false;
      console.error('Error al generar PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo generar el PDF. Intente nuevamente.',
        icon: 'error',
      });
    }
  }

  /**
   * Crea la tabla de actividades eclesiásticas para el PDF
   */
  private crearTablaActividades(): any {
    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', '*'],
        body: [
          [
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Tipo de Actividad', style: 'tableHeader' },
            { text: 'Responsable', style: 'tableHeader' },
            { text: 'Asistencia', style: 'tableHeader' },
            { text: 'Observaciones', style: 'tableHeader' },
          ],
          ...this.actividadesEclesiasticas.map((act) => [
            { text: new Date(act.fecha).toLocaleDateString(), style: 'tableCell' },
            { text: this.buscarNombreTipoActividad(act.tipoActividad_id), style: 'tableCell' },
            { text: act.responsable || '-', style: 'tableCell' },
            { text: act.asistencia?.toString() || '0', style: 'tableCell', alignment: 'center' },
            { text: act.observaciones || '-', style: 'tableCell' },
          ]),
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10],
    };
  }

  /**
   * Crea la tabla de actividades económicas para el PDF
   */
  private crearTablaActividadesEconomicas(): any {
    return {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', '*'],
        body: [
          [
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Tipo de Actividad', style: 'tableHeader' },
            { text: 'Responsable', style: 'tableHeader' },
            { text: 'Cantidad Recaudada', style: 'tableHeader' },
            { text: 'Observaciones', style: 'tableHeader' },
          ],
          ...this.actividadesEconomicas.map((act) => [
            { text: new Date(act.fecha).toLocaleDateString(), style: 'tableCell' },
            { text: this.buscarNombreTipoActividadEconomica(act.tipoActividadEconomica_id), style: 'tableCell' },
            { text: act.responsable || '-', style: 'tableCell' },
            { text: `$${Number(act.cantidadRecaudada || 0).toFixed(2)}`, style: 'tableCell', alignment: 'right' },
            { text: act.observaciones || '-', style: 'tableCell' },
          ]),
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10],
    };
  }

  /**
   * Crea la tabla de visitas para el PDF
   */
  private crearTablaVisitas(): any {
    return {
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', '*'],
        body: [
          [
            { text: 'Mes', style: 'tableHeader' },
            { text: 'Visitas Hogares', style: 'tableHeader' },
            { text: 'Referidas OOTS', style: 'tableHeader' },
            { text: 'Visitas Hospital', style: 'tableHeader' },
            { text: 'Observaciones', style: 'tableHeader' },
          ],
          ...this.visitas.map((visita) => [
            { text: this.getNombreMes(visita.mes), style: 'tableCell' },
            { text: (visita.visitasHogares || 0).toString(), style: 'tableCell', alignment: 'center' },
            { text: (visita.referidasOots || 0).toString(), style: 'tableCell', alignment: 'center' },
            { text: (visita.visitaHospital || 0).toString(), style: 'tableCell', alignment: 'center' },
            { text: visita.observaciones || '-', style: 'tableCell' },
          ]),
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10],
    };
  }

  /**
   * Crea la tabla de diezmos para el PDF
   */
  private crearTablaDiezmos(): any {
    const totalSobresRestrictos = this.calcularTotal(this.diezmos, 'sobresRestrictos');
    const totalSobresNoRestrictos = this.calcularTotal(this.diezmos, 'sobresNoRestrictos');
    const totalRestrictos = this.calcularTotal(this.diezmos, 'restrictos');
    const totalNoRestrictos = this.calcularTotal(this.diezmos, 'noRestrictos');
    const totalGeneral = totalRestrictos + totalNoRestrictos;

    return {
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Mes', style: 'tableHeader' },
            { text: 'Sobres Restrictos', style: 'tableHeader' },
            { text: 'Sobres No Restrictos', style: 'tableHeader' },
            { text: 'Restrictos ($)', style: 'tableHeader' },
            { text: 'No Restrictos ($)', style: 'tableHeader' },
            { text: 'Total ($)', style: 'tableHeader' },
          ],
          ...this.diezmos.map((diezmo) => [
            { text: this.getNombreMes(diezmo.mes), style: 'tableCell' },
            { text: (diezmo.sobresRestrictos || 0).toString(), style: 'tableCell', alignment: 'center' },
            { text: (diezmo.sobresNoRestrictos || 0).toString(), style: 'tableCell', alignment: 'center' },
            { text: `$${Number(diezmo.restrictos || 0).toFixed(2)}`, style: 'tableCell', alignment: 'right' },
            { text: `$${Number(diezmo.noRestrictos || 0).toFixed(2)}`, style: 'tableCell', alignment: 'right' },
            {
              text: `$${(Number(diezmo.restrictos || 0) + Number(diezmo.noRestrictos || 0)).toFixed(2)}`,
              style: 'tableCell',
              alignment: 'right',
            },
          ]),
          [
            { text: 'TOTAL', style: 'tableHeader' },
            { text: totalSobresRestrictos.toString(), style: 'tableHeader', alignment: 'center' },
            { text: totalSobresNoRestrictos.toString(), style: 'tableHeader', alignment: 'center' },
            { text: `$${totalRestrictos.toFixed(2)}`, style: 'tableHeader', alignment: 'right' },
            { text: `$${totalNoRestrictos.toFixed(2)}`, style: 'tableHeader', alignment: 'right' },
            { text: `$${totalGeneral.toFixed(2)}`, style: 'tableHeader', alignment: 'right' },
          ],
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10],
    };
  }

  /**
   * Crea la tabla de situaciones para el PDF
   */
  private crearTablaSituaciones(): any {
    return {
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', '*', '*', 'auto', '*'],
        body: [
          [
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Nombre Feligrés', style: 'tableHeader' },
            { text: 'Situación', style: 'tableHeader' },
            { text: 'Intervención', style: 'tableHeader' },
            { text: 'Seguimiento', style: 'tableHeader' },
            { text: 'Observaciones', style: 'tableHeader' },
          ],
          ...this.situacionVisitas.map((sit) => [
            { text: new Date(sit.fecha).toLocaleDateString(), style: 'tableCell' },
            { text: sit.nombreFeligres || '-', style: 'tableCell' },
            { text: sit.situacion || '-', style: 'tableCell' },
            { text: sit.intervencion || '-', style: 'tableCell' },
            { text: sit.seguimiento || '-', style: 'tableCell' },
            { text: sit.observaciones || '-', style: 'tableCell' },
          ]),
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10],
    };
  }

  /**
   * Crea la tabla de logros para el PDF
   */
  private crearTablaLogros(): any {
    return {
      table: {
        headerRows: 1,
        widths: ['*'],
        body: [
          [{ text: 'Logro', style: 'tableHeader' }],
          ...this.logros.map((logro) => [{ text: logro.logro || '-', style: 'tableCell' }]),
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10],
    };
  }

  /**
   * Crea la tabla de metas para el PDF
   */
  private crearTablaMetas(): any {
    return {
      table: {
        headerRows: 1,
        widths: ['*'],
        body: [
          [{ text: 'Meta', style: 'tableHeader' }],
          ...this.metas.map((meta) => [{ text: meta.meta || '-', style: 'tableCell' }]),
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10],
    };
  }

  /**
   * Navega de regreso a la página de informe
   */
  volverAlInforme(): void {
    // Si viene de ver-informes-pais (tiene informeIdParam), volver ahí
    if (this.informeIdParam) {
      this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.VER_INFORMES_PAIS}`);
    } else {
      // Si es el informe del usuario actual, volver a la página de informe normal
      this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
    }
  }

  /**
   * Busca el nombre del tipo de actividad económica por ID
   */
  buscarNombreTipoActividadEconomica(id: number): string {
    const tipo = this.tiposActividadEconomica.find((t) => t.id === id);
    return tipo?.nombre || 'N/A';
  }

  /**
   * Calcula el total de una propiedad numérica en un array
   */
  calcularTotal(items: any[], propiedad: string): number {
    return items.reduce((total, item) => total + (Number(item[propiedad]) || 0), 0);
  }

  /**
   * Obtiene el nombre del mes a partir del número
   */
  getNombreMes(mes: number): string {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return meses[mes - 1] || '-';
  }
}
