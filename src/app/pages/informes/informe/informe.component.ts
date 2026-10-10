import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  generarSeccioninforme,
  Seccion,
  EstatusSeccion,
  ColorEstatus,
  NombreSeccion,
} from 'src/app/core/interfaces/seccion-informe.interface';
import { EstatusSeccionesInforme } from 'src/app/core/interfaces/informe.interface';
import { InformeModel } from 'src/app/core/models/informe.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

import { SeccionInformeComponent } from '../../../components/seccion-informe/seccion-informe.component';
import {
  obtenerFechaCierreInforme,
  obtenerFechasPeriodoInforme,
  formatearFechaCierreLocal,
  obtenerPeriodoInforme,
} from 'src/app/core/utils/periodo-informe';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss'],
  standalone: true,
  imports: [CommonModule, SeccionInformeComponent],
})
export class InformeComponent implements OnInit {
  private router = inject(Router);
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);

  informes: InformeModel[] = [];
  generarSeccioninforme: Seccion[] = [];

  diasFinTrimestre: number;
  hayInformeAbierto: boolean = false;
  cargando: boolean = false;

  // Fechas clave del trimestre actual y del cierre automático del informe (calculadas en ngOnInit)
  fechaFinTrimestre: Date;
  fechaCierreInforme: Date;
  fechaInicioTrimestre: Date;
  fechaCierreInformeTexto = '';

  informeProximoACerrar: boolean = false;

  get Rutas() {
    return RUTAS;
  }

  ngOnInit(): void {
    this.diasFinTrimestre = this.calcularDiasFinTrimestre();
    this.calcularFechasClave();
    this.verificarInformeAbierto();
  }

  /**
   * Mantiene activo el trimestre anterior durante la gracia de cierre del backend.
   */
  getTrimestresActual(): number {
    return this.getPeriodoTrimestreActual().trimestre;
  }

  getAnioInforme(): number {
    return this.getPeriodoTrimestreActual().anio;
  }

  formatearTrimestre(trimestre: number): string {
    return ['1er', '2do', '3er', '4to'][trimestre - 1];
  }

  esPeriodoEspecialTercerTrimestre2026(): boolean {
    return this.getTrimestresActual() === 3 && this.getAnioInforme() === 2026;
  }

  obtenerMensajeDisponibilidadInforme(): string {
    if (this.esPeriodoEspecialTercerTrimestre2026()) {
      return 'El informe del 3er trimestre de 2026 (julio, agosto y septiembre) estará disponible hasta el martes 13 de octubre de 2026. El informe del 4to trimestre (octubre, noviembre y diciembre) podrá abrirse a partir del miércoles 14 de octubre de 2026.';
    }

    return `Tendrá hasta el ${this.fechaCierreInformeTexto}, hora de Colombia (UTC-5), para completarlo antes de que se cierre automáticamente.`;
  }

  private getPeriodoTrimestreActual(): { trimestre: number; anio: number } {
    return obtenerPeriodoInforme();
  }

  /**
   * Calcula la fecha de fin del trimestre actual, la fecha en que el sistema
   * cerrará automáticamente el informe (8 días después, a las 00:00:05) y
   * verifica si el informe del trimestre anterior sigue en su periodo de gracia.
   */
  private calcularFechasClave(): void {
    const { trimestre, anio } = this.getPeriodoTrimestreActual();
    const inicioSiguienteTrimestre = new Date(Date.UTC(anio, trimestre * 3, 1, 5));

    // El último día real del trimestre (para mostrar al usuario) es el mismo que se envía al backend
    // en obtenerFechasTrimestreActual(); finTrimestreMs es el instante de inicio del SIGUIENTE trimestre
    // y solo debe usarse para calcular la fecha exacta de cierre automático, no para mostrarla.
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    this.fechaInicioTrimestre = new Date(fechaInicio + 'T00:00:00');
    this.fechaFinTrimestre = new Date(fechaFin + 'T23:59:59');
    this.fechaCierreInforme = obtenerFechaCierreInforme(trimestre, anio);
    this.fechaCierreInformeTexto = formatearFechaCierreLocal(this.fechaCierreInforme);
    const ahora = new Date();
    this.informeProximoACerrar = ahora >= inicioSiguienteTrimestre && ahora < this.fechaCierreInforme;
  }

  /**
   * Aplica el estatus (completado/pendiente) de cada sección recibido del backend en una sola llamada
   */
  private aplicarEstatusSecciones(secciones: EstatusSeccionesInforme): void {
    const seccionCompletada: Record<string, boolean> = {
      [NombreSeccion.ACTIVIDADES_ECLESIASTICAS]: secciones.actividades,
      [NombreSeccion.METAS]: secciones.metas,
      [NombreSeccion.VISITAS]: secciones.visitas,
      [NombreSeccion.SITUACION_VISITAS]: secciones.situacionVisitas,
      [NombreSeccion.LOGROS_OBTENIDOS]: secciones.logros,
      [NombreSeccion.ASPECTO_ESPIRITUAL]: secciones.aspectoEspiritual,
      [NombreSeccion.ACTIVIDADES_ECONOMICAS]: secciones.actividadesEconomicas,
      [NombreSeccion.ASUNTOS_PENDIENTES]: secciones.asuntosPendientes,
      [NombreSeccion.ASPECTOS_CONTABLES]: secciones.aspectoContable,
    };

    this.generarSeccioninforme = generarSeccioninforme.map((seccion) => {
      const completado = seccionCompletada[seccion.nombre] ?? false;
      return {
        ...seccion,
        estatus: completado ? EstatusSeccion.COMPLETADO : EstatusSeccion.PENDIENTE,
        color: completado ? ColorEstatus.COMPLETADO : ColorEstatus.PENDIENTE,
      };
    });
  }

  /**
   * Verifica si existe un informe abierto para el trimestre actual y, de una sola vez,
   * obtiene el estatus de todas las secciones (endpoint consolidado /informe/resumen)
   */
  verificarInformeAbierto(): void {
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    const usuarioId = this.usuarioService.usuarioId;

    this.cargando = true;

    this.informeService.cargarResumenInforme(usuarioId, fechaInicio, fechaFin).subscribe(
      (respuesta) => {
        this.hayInformeAbierto = respuesta.tieneInformeAbierto;

        if (respuesta.tieneInformeAbierto && respuesta.secciones) {
          this.aplicarEstatusSecciones(respuesta.secciones);
        } else {
          this.generarSeccioninforme = [...generarSeccioninforme];
        }
        this.cargando = false;
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
    const { trimestre, anio } = this.getPeriodoTrimestreActual();
    const fechaFinTrimestre = new Date(anio, trimestre * 3, 1).getTime();

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
    const { min, max } = obtenerFechasPeriodoInforme();
    return { fechaInicio: min, fechaFin: max };
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
            text: `¿Desea generar un nuevo informe para el ${this.getTrimestresActual()}${this.getTrimestresActual() === 1 ? 'er' : this.getTrimestresActual() === 3 ? 'er' : 'do'} trimestre? ${this.obtenerMensajeDisponibilidadInforme()}`,
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
      periodo: fechaInicio,
    };

    this.informeService.crearInforme(nuevoInforme).subscribe(
      (respuesta: any) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El informe se ha generado correctamente.',
          icon: 'success',
        });
        // Volver a verificar si el informe está abierto y actualizar la vista (ya recarga las secciones internamente)
        this.verificarInformeAbierto();
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
