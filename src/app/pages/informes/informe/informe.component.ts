import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import {
  generarSeccioninforme,
  Seccion,
  EstatusSeccion,
  ColorEstatus,
  NombreSeccion,
} from 'src/app/core/interfaces/seccion-informe.interface';
import { InformeModel } from 'src/app/core/models/informe.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { LogroService } from 'src/app/services/logro/logro.service';
import { MetaService } from 'src/app/services/meta/meta.service';
import { SituacionVisitaService } from 'src/app/services/situacion-visita/situacion-visita.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { VisitaService } from 'src/app/services/visita/visita.service';
import Swal from 'sweetalert2';

import { SeccionInformeComponent } from '../../../components/seccion-informe/seccion-informe.component';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss'],
  standalone: true,
  imports: [SeccionInformeComponent],
})
export class InformeComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);
  private actividadService = inject(ActividadService);
  private contabilidadService = inject(ContabilidadService);
  private metaService = inject(MetaService);
  private visitaService = inject(VisitaService);
  private situacionVisitaService = inject(SituacionVisitaService);
  private logroService = inject(LogroService);

  informes: InformeModel[] = [];
  generarSeccioninforme: Seccion[] = [];

  diasFinTrimestre: number;
  hayInformeAbierto: boolean = false;
  cargando: boolean = false;

  currYear = new Date().getFullYear();

  trimestreActual = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  finPrimerTrimestre = new Date('april 1, ' + this.currYear + ' 00:00:00').getTime();
  finSegundoTrimestre = new Date('july 1, ' + this.currYear + ' 00:00:00').getTime();
  finTercerTrimestre = new Date('october 1, ' + this.currYear + ' 00:00:00').getTime();
  finCuartoTrimestre = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  trimestres = [this.finPrimerTrimestre, this.finSegundoTrimestre, this.finTercerTrimestre, this.finCuartoTrimestre];

  get Rutas() {
    return RUTAS;
  }

  ngOnInit(): void {
    this.diasFinTrimestre = this.calcularDiasFinTrimestre();
    this.verificarInformeAbierto();

    // Escuchar cambios de navegación para recargar secciones
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.url.includes('/informe') && !event.url.includes('/informe-')) {
        this.cargarSeccionesConEstatus();
      }
    });
  }

  /**
   * Retorna el número del trimestre actual (1, 2, 3 o 4)
   * basándose en el mes actual
   */
  getTrimestresActual(): number {
    const mesActual = new Date().getMonth(); // 0-11 (0=Enero, 11=Diciembre)
    return Math.floor(mesActual / 3) + 1;
  }

  /**
   * Carga las secciones del informe y actualiza su estatus dinámicamente
   */
  cargarSeccionesConEstatus(): void {
    const informeId = this.informeService.informeActivoId;

    if (!informeId) {
      // Si no hay informe activo, usar secciones estáticas
      this.generarSeccioninforme = [...generarSeccioninforme];
      return;
    }

    this.cargando = true;

    // Cargar datos de todas las secciones en paralelo
    forkJoin({
      actividades: this.actividadService.getActividad(),
      contabilidad: this.contabilidadService.getContabilidad(),
      metas: this.metaService.getMetas(),
      visitas: this.visitaService.getVisita(),
      situacionVisitas: this.situacionVisitaService.getSituacionVisitas(),
      logros: this.logroService.getLogros(),
    }).subscribe({
      next: (datos) => {
        // Filtrar por informe_id actual (con validación de datos)
        const actividadesFiltradas = (datos.actividades || []).filter(
          (a: any) => Number(a.informe_id) === Number(informeId),
        );
        const contabilidadFiltrada = (datos.contabilidad || []).filter(
          (c: any) => Number(c.informe_id) === Number(informeId),
        );
        const metasFiltradas = (datos.metas || []).filter((m: any) => Number(m.informe_id) === Number(informeId));
        const visitasFiltradas = (datos.visitas || []).filter((v: any) => Number(v.informe_id) === Number(informeId));
        const situacionVisitasFiltradas = (datos.situacionVisitas || []).filter(
          (s: any) => Number(s.informe_id) === Number(informeId),
        );
        const logrosFiltrados = (datos.logros || []).filter((l: any) => Number(l.informe_id) === Number(informeId));

        // Actualizar el estatus de cada sección
        this.generarSeccioninforme = generarSeccioninforme.map((seccion) => {
          let estatus = EstatusSeccion.PENDIENTE;
          let color = ColorEstatus.PENDIENTE;

          // Determinar estatus basado en la sección
          if (seccion.nombre === NombreSeccion.INFORME_ACTIVIDADES && actividadesFiltradas.length > 0) {
            estatus = EstatusSeccion.COMPLETADO;
            color = ColorEstatus.COMPLETADO;
          } else if (seccion.nombre === NombreSeccion.ASPECTOS_CONTABLES && contabilidadFiltrada.length > 0) {
            estatus = EstatusSeccion.COMPLETADO;
            color = ColorEstatus.COMPLETADO;
          } else if (seccion.nombre === NombreSeccion.METAS && metasFiltradas.length > 0) {
            estatus = EstatusSeccion.COMPLETADO;
            color = ColorEstatus.COMPLETADO;
          } else if (seccion.nombre === NombreSeccion.VISITAS && visitasFiltradas.length > 0) {
            estatus = EstatusSeccion.COMPLETADO;
            color = ColorEstatus.COMPLETADO;
          } else if (seccion.nombre === NombreSeccion.SITUACION_VISITAS && situacionVisitasFiltradas.length > 0) {
            estatus = EstatusSeccion.COMPLETADO;
            color = ColorEstatus.COMPLETADO;
          } else if (seccion.nombre === NombreSeccion.LOGROS_OBTENIDOS && logrosFiltrados.length > 0) {
            estatus = EstatusSeccion.COMPLETADO;
            color = ColorEstatus.COMPLETADO;
          }

          return {
            ...seccion,
            estatus,
            color,
          };
        });
        this.cargando = false;
      },
      error: () => {
        this.generarSeccioninforme = [...generarSeccioninforme];
        this.cargando = false;
      },
    });
  }

  /**
   * Verifica si existe un informe abierto para el trimestre actual
   */
  verificarInformeAbierto(): void {
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    const usuarioId = this.usuarioService.usuarioId;

    this.cargando = true;

    // Usar cargarInformeActivo para guardar el informe en el servicio
    this.informeService.cargarInformeActivo(usuarioId, fechaInicio, fechaFin).subscribe(
      (respuesta) => {
        this.hayInformeAbierto = respuesta.tieneInformeAbierto;

        if (respuesta.tieneInformeAbierto) {
          // Si hay informe abierto, cargar las secciones con su estatus
          this.cargarSeccionesConEstatus();
        } else {
          // Si no hay informe abierto, mostrar secciones estáticas y detener carga
          this.generarSeccioninforme = [...generarSeccioninforme];
          this.cargando = false;
        }
      },
      (error) => {
        this.hayInformeAbierto = false;
        this.generarSeccioninforme = [...generarSeccioninforme];
        this.cargando = false;
      },
    );
  }

  /**
   * Calcula cuántos días faltan para el fin del trimestre actual
   */
  calcularDiasFinTrimestre(): number {
    const ahora = new Date().getTime();
    const trimestreActual = this.getTrimestresActual();

    // Obtener la fecha de fin del trimestre actual
    const fechaFinTrimestre = this.trimestres[trimestreActual - 1];

    // Calcular la diferencia en milisegundos
    const diferencia = fechaFinTrimestre - ahora;

    // Convertir a días
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    return dias;
  }

  /**
   * Obtiene las fechas de inicio y fin del trimestre actual
   */
  obtenerFechasTrimestreActual(): { fechaInicio: string; fechaFin: string } {
    const hoy = new Date();
    const mes = hoy.getMonth(); // 0-11
    const anio = hoy.getFullYear();
    const trimestre = Math.floor(mes / 3) + 1;

    let fechaInicio: Date;
    let fechaFin: Date;

    switch (trimestre) {
      case 1: // Enero - Marzo
        fechaInicio = new Date(anio, 0, 1);
        fechaFin = new Date(anio, 2, 31);
        break;
      case 2: // Abril - Junio
        fechaInicio = new Date(anio, 3, 1);
        fechaFin = new Date(anio, 5, 30);
        break;
      case 3: // Julio - Septiembre
        fechaInicio = new Date(anio, 6, 1);
        fechaFin = new Date(anio, 8, 30);
        break;
      case 4: // Octubre - Diciembre
        fechaInicio = new Date(anio, 9, 1);
        fechaFin = new Date(anio, 11, 31);
        break;
    }

    return {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    };
  }

  /**
   * Verifica si existe un informe abierto para el trimestre actual
   * antes de permitir generar un nuevo informe
   */
  generarInforme() {
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    const usuarioId = this.usuarioService.usuarioId;

    this.informeService.verificarInformeAbierto(usuarioId, fechaInicio, fechaFin).subscribe(
      (respuesta) => {
        if (respuesta.tieneInformeAbierto) {
          // Ya existe un informe abierto
          Swal.fire({
            title: 'Informe ya existe',
            text: `Ya existe un informe abierto para el ${this.getTrimestresActual()}${this.getTrimestresActual() === 1 ? 'er' : this.getTrimestresActual() === 3 ? 'er' : 'do'} trimestre.`,
            icon: 'info',
            confirmButtonText: 'Entendido',
          });
        } else {
          // No existe informe, mostrar confirmación para crear uno nuevo
          Swal.fire({
            title: 'Generar Informe',
            text: `¿Desea generar un nuevo informe para el ${this.getTrimestresActual()}${this.getTrimestresActual() === 1 ? 'er' : this.getTrimestresActual() === 3 ? 'er' : 'do'} trimestre?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, generar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.crearNuevoInforme(fechaInicio, fechaFin);
            }
          });
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo verificar el estado del informe. Intente nuevamente.',
          icon: 'error',
        });
      },
    );
  }

  /**
   * Crea un nuevo informe para el trimestre actual
   */
  private crearNuevoInforme(fechaInicio: string, fechaFin: string) {
    const nuevoInforme = {
      usuario_id: this.usuarioService.usuarioId,
    };

    this.informeService.crearInforme(nuevoInforme).subscribe(
      (respuesta: any) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El informe se ha generado correctamente.',
          icon: 'success',
        });
        // Volver a verificar si el informe está abierto y actualizar la vista
        this.verificarInformeAbierto();
        // Recargar secciones con nuevo estatus
        this.cargarSeccionesConEstatus();
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo generar el informe. Intente nuevamente.',
          icon: 'error',
        });
      },
    );
  }

  /**
   * Navega a la página de ver informe completo
   */
  verInformeCompleto(): void {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.VER_INFORME}`);
  }
}
