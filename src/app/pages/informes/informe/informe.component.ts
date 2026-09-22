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

// Días de gracia que otorga el backend después de finalizar el trimestre antes de cerrar el informe automáticamente
const DIAS_GRACIA_CIERRE_INFORME = 8;

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

  currYear = new Date().getFullYear();

  trimestreActual = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  finPrimerTrimestre = new Date('april 1, ' + this.currYear + ' 00:00:00').getTime();
  finSegundoTrimestre = new Date('july 1, ' + this.currYear + ' 00:00:00').getTime();
  finTercerTrimestre = new Date('october 1, ' + this.currYear + ' 00:00:00').getTime();
  finCuartoTrimestre = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  trimestres = [this.finPrimerTrimestre, this.finSegundoTrimestre, this.finTercerTrimestre, this.finCuartoTrimestre];

  // Fechas clave del trimestre actual y del cierre automático del informe (calculadas en ngOnInit)
  fechaFinTrimestre: Date;
  fechaCierreInforme: Date;
  fechaInicioTrimestre: Date;

  // Fecha en que se cerrará automáticamente el informe del trimestre que acaba de terminar (periodo de gracia)
  fechaCierreInformeAnterior: Date;
  enPeriodoGraciaTrimestreAnterior: boolean = false;

  get Rutas() {
    return RUTAS;
  }

  ngOnInit(): void {
    this.diasFinTrimestre = this.calcularDiasFinTrimestre();
    this.calcularFechasClave();
    this.verificarInformeAbierto();
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
   * Calcula la fecha de fin del trimestre actual, la fecha en que el sistema
   * cerrará automáticamente el informe (8 días después, a las 00:00:05) y
   * verifica si el informe del trimestre anterior sigue en su periodo de gracia.
   */
  private calcularFechasClave(): void {
    const trimestreActual = this.getTrimestresActual();
    const finTrimestreMs = this.trimestres[trimestreActual - 1];

    // El último día real del trimestre (para mostrar al usuario) es el mismo que se envía al backend
    // en obtenerFechasTrimestreActual(); finTrimestreMs es el instante de inicio del SIGUIENTE trimestre
    // y solo debe usarse para calcular la fecha exacta de cierre automático, no para mostrarla.
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    this.fechaInicioTrimestre = new Date(fechaInicio + 'T00:00:00');
    this.fechaFinTrimestre = new Date(fechaFin + 'T23:59:59');
    this.fechaCierreInforme = this.calcularFechaCierre(finTrimestreMs);

    const finTrimestreAnteriorMs =
      trimestreActual === 1
        ? new Date('january 1, ' + this.currYear + ' 00:00:00').getTime()
        : this.trimestres[trimestreActual - 2];

    this.fechaCierreInformeAnterior = this.calcularFechaCierre(finTrimestreAnteriorMs);
    this.enPeriodoGraciaTrimestreAnterior = new Date().getTime() < this.fechaCierreInformeAnterior.getTime();
  }

  /**
   * Dada la fecha (ms) de fin de un trimestre, retorna la fecha/hora en que
   * el informe correspondiente se cerrará automáticamente (regla del backend: 00:00:05)
   */
  private calcularFechaCierre(finTrimestreMs: number): Date {
    const fechaCierre = new Date(finTrimestreMs);
    fechaCierre.setDate(fechaCierre.getDate() + DIAS_GRACIA_CIERRE_INFORME);
    fechaCierre.setHours(0, 0, 5, 0);
    return fechaCierre;
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
          const fechaCierreTexto = this.fechaCierreInforme.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });
          Swal.fire({
            title: 'Generar Informe',
            text: `¿Desea generar un nuevo informe para el ${this.getTrimestresActual()}${this.getTrimestresActual() === 1 ? 'er' : this.getTrimestresActual() === 3 ? 'er' : 'do'} trimestre? Tendrá hasta el ${fechaCierreTexto} para completarlo antes de que se cierre automáticamente.`,
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
