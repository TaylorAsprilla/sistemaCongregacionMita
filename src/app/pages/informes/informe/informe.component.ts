import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  generarSeccioninforme,
  Seccion,
  EstatusSeccion,
  ColorEstatus,
  NombreSeccion,
} from 'src/app/core/interfaces/seccion-informe.interface';
import {
  AmbitoInformeInterface,
  EstatusSeccionesInforme,
} from 'src/app/core/interfaces/informe.interface';
import { ESTADO_INFORME_ENUM, InformeModel } from 'src/app/core/models/informe.model';
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

function escaparHtml(valor: string): string {
  return valor.replace(/[&<>"']/g, (caracter) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[caracter] ?? caracter);
}

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss'],
  standalone: true,
  imports: [CommonModule, SeccionInformeComponent],
})
export class InformeComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);
  private resumenSubscription?: Subscription;
  cerrando = false;

  ngOnDestroy(): void {
    this.resumenSubscription?.unsubscribe();
  }

  informes: InformeModel[] = [];
  ambitos: AmbitoInformeInterface[] = [];
  ambitoSeleccionado: AmbitoInformeInterface | null = null;
  informesLegados: {
    id: number;
    usuario_id: number;
    estado: string;
    periodo: string | null;
    createdAt: string;
    updatedAt: string;
  }[] = [];
  informeLegadoSeleccionado: { id: number; usuario_id: number; estado: string } | null = null;
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
      return `El informe del 3er trimestre de 2026 (julio, agosto y septiembre) puede completarse hasta su cierre automático: ${this.fechaCierreInformeTexto}. Desde ese momento podrás abrir el informe del 4to trimestre (octubre, noviembre y diciembre).`;
    }

    return `Tendrá hasta el ${this.fechaCierreInformeTexto} para completarlo antes de que se cierre automáticamente. La fecha y hora corresponden a la zona horaria local de su dispositivo.`;
  }

  private getPeriodoTrimestreActual(): { trimestre: number; anio: number } {
    return obtenerPeriodoInforme();
  }

  /**
   * Calcula la fecha de fin del trimestre actual, la fecha en que el sistema
   * cerrará automáticamente el informe según el plazo configurado a las 05:05 UTC y
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
    const { fechaInicio } = this.obtenerFechasTrimestreActual();
    this.cargando = true;
    this.informeService.getMisResponsabilidades(fechaInicio).subscribe({
      next: (respuesta) => {
        this.ambitos = respuesta.ambitos;
        this.informesLegados = respuesta.legados ?? [];
        const activoId = this.informeService.informeActivoId;
        const seleccionado = this.ambitos.find(
          (ambito) =>
            ambito.informe?.id === activoId &&
            ambito.informe.estado === ESTADO_INFORME_ENUM.ABIERTO,
        );
        if (seleccionado) {
          this.seleccionarInforme(seleccionado);
        } else {
          const legado = this.informesLegados.find(
            (informe) => informe.id === activoId,
          );
          if (legado) {
            this.seleccionarInformeLegado(legado);
          } else {
            this.informeService.limpiarInformeActivo();
            this.ambitoSeleccionado = null;
            this.informeLegadoSeleccionado = null;
            this.hayInformeAbierto = false;
            this.generarSeccioninforme = [...generarSeccioninforme];
          }
        }
        if (!this.ambitoSeleccionado && !this.informeLegadoSeleccionado) this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar responsabilidades de informes:', error);
        this.hayInformeAbierto = false;
        this.ambitos = [];
        this.generarSeccioninforme = [...generarSeccioninforme];
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las congregaciones asignadas. Intenta nuevamente.',
          icon: 'error',
        });
      },
    });
  }

  tipoUnidadTexto(ambito: AmbitoInformeInterface): string {
    return {
      PAIS: 'Congregación País',
      CONGREGACION: 'Congregación Ciudad',
      CAMPO: 'Congregación Campo',
    }[ambito.tipo_congregacion];
  }

  generarInforme(ambito: AmbitoInformeInterface): void {
    if (ambito.informe) {
      if (ambito.informe.estado === ESTADO_INFORME_ENUM.ABIERTO) {
        this.seleccionarInforme(ambito);
      } else {
        this.verInforme(ambito.informe.id);
      }
      return;
    }

    Swal.fire({
      title: 'Generar informe',
      text: `¿Desea generar el informe para ${ambito.nombre_unidad} (${this.tipoUnidadTexto(ambito)}) del ${this.formatearTrimestre(this.getTrimestresActual())} trimestre de ${this.getAnioInforme()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar',
    }).then((resultado) => {
      if (resultado.isConfirmed) this.crearNuevoInforme(ambito);
    });
  }

  seleccionarInforme(ambito: AmbitoInformeInterface): void {
    const informe = ambito.informe;
    if (!informe || informe.estado !== ESTADO_INFORME_ENUM.ABIERTO) return;

    this.ambitoSeleccionado = ambito;
    this.informeLegadoSeleccionado = null;
    this.informeService.informeActivo = {
      ...informe,
      tipo_congregacion: ambito.tipo_congregacion,
      nombre_unidad: ambito.nombre_unidad,
      nombre_pais: ambito.nombre_pais,
      nombre_congregacion: ambito.nombre_congregacion,
      nombre_campo: ambito.nombre_campo,
    };
    this.cargarResumenSeleccionado(informe.id);
  }

  seleccionarInformeLegado(
    informe: NonNullable<InformeService['informeActivo']>,
  ): void {
    this.ambitoSeleccionado = null;
    this.informeLegadoSeleccionado = informe;
    this.informeService.informeActivo = informe;
    this.cargarResumenSeleccionado(informe.id);
  }

  private cargarResumenSeleccionado(informeId: number): void {
    this.resumenSubscription?.unsubscribe();
    this.hayInformeAbierto = false;
    this.generarSeccioninforme = [];
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    this.cargando = true;
    this.resumenSubscription = this.informeService
      .cargarResumenInforme(
        this.usuarioService.usuarioId,
        fechaInicio,
        fechaFin,
        informeId,
      )
      .subscribe({
        next: (respuesta) => {
          this.hayInformeAbierto = respuesta.tieneInformeAbierto;
          if (respuesta.secciones) {
            this.aplicarEstatusSecciones(respuesta.secciones);
          } else {
            this.generarSeccioninforme = [...generarSeccioninforme];
          }
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar el informe seleccionado:', error);
          this.hayInformeAbierto = false;
          this.cargando = false;
          Swal.fire({
            title: 'Error',
            text: 'No se pudo abrir el informe seleccionado.',
            icon: 'error',
          });
        },
      });
  }

  verInforme(id: number): void {
    this.router.navigateByUrl(
      `${RUTAS.SISTEMA}/${RUTAS.VER_INFORME}/${id}?origen=${RUTAS.INFORME}`,
    );
  }

  cerrarInforme(): void {
    const informeId = this.informeService.informeActivoId;
    if (!informeId || !this.ambitoSeleccionado || this.cerrando || this.cargando) return;
    this.cerrando = true;
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    this.informeService.obtenerResumenInforme(
      this.usuarioService.usuarioId, fechaInicio, fechaFin, informeId,
    ).subscribe({
      next: (respuesta) => {
        this.cerrando = false;
        if (this.informeService.informeActivoId !== informeId) return;
        if (respuesta.secciones) this.aplicarEstatusSecciones(respuesta.secciones);
        this.confirmarCierre(informeId);
      },
      error: () => {
        this.cerrando = false;
        Swal.fire('Error', 'No se pudo cargar el resumen del informe. Intenta nuevamente.', 'error');
      },
    });
  }

  private confirmarCierre(informeId: number): void {
    const ambito = this.ambitoSeleccionado;
    if (!ambito) return;
    const conDatos = this.generarSeccioninforme
      .filter((seccion) => seccion.estatus === EstatusSeccion.COMPLETADO)
      .map((seccion) => seccion.nombre);
    const periodo = ambito.informe?.periodo;
    const [anio, mes] = periodo?.slice(0, 10).split('-').map(Number) ?? [];
    const trimestre = mes && anio
      ? `${this.formatearTrimestre(Math.ceil(mes / 3))} trimestre de ${anio}`
      : `${this.formatearTrimestre(this.getTrimestresActual())} trimestre de ${this.getAnioInforme()}`;
    const responsables = ambito.responsables.map((responsable) =>
      responsable.nombre_responsable,
    );
    const campos = [
      [this.tipoUnidadTexto(ambito), ambito.nombre_unidad],
      ['Período', trimestre],
      ['Responsables', responsables.join(', ') || 'Sin responsables disponibles'],
      ['Secciones con datos', conDatos.join(', ') || 'Ninguna'],
    ];
    const resumen = `
      <div class="informe-cierre-resumen">
        ${campos.map(([etiqueta, valor]) => `
          <div class="informe-cierre-resumen__campo">
            <span class="informe-cierre-resumen__etiqueta">${escaparHtml(etiqueta)}</span>
            <strong class="informe-cierre-resumen__valor">${escaparHtml(valor)}</strong>
          </div>
        `).join('')}
        <p class="informe-cierre-resumen__advertencia">
          <i class="fa fa-lock" aria-hidden="true"></i>
          Al cerrarlo, estos responsables y la información del informe quedarán como registro histórico y ya no podrá editarse.
        </p>
      </div>
    `;
    Swal.fire({
      title: 'Cerrar informe',
      html: resumen,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cerrar informe',
      cancelButtonText: 'Seguir editando',
      customClass: { popup: 'informe-cierre-modal' },
    }).then((resultado) => {
      if (!resultado.isConfirmed || this.informeService.informeActivoId !== informeId) return;
      this.informeService.cerrarInforme(informeId).subscribe({
        next: () => {
          if (this.informeService.informeActivoId === informeId) {
            this.informeService.limpiarInformeActivo();
            this.ambitoSeleccionado = null;
            this.informeLegadoSeleccionado = null;
            this.hayInformeAbierto = false;
          }
          this.verificarInformeAbierto();
        },
        error: (error) => {
          console.error('Error al cerrar el informe:', error);
          Swal.fire({
            title: 'Error',
            text: error.error?.msg ?? 'No se pudo cerrar el informe.',
            icon: 'error',
          });
        },
      });
    });
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
  /**
   * Crea un nuevo informe para el trimestre actual
   */
  private crearNuevoInforme(ambito: AmbitoInformeInterface) {
    const nuevoInforme = new InformeModel();
    nuevoInforme.periodo = this.obtenerFechasTrimestreActual().fechaInicio;
    nuevoInforme.tipo_congregacion = ambito.tipo_congregacion;
    nuevoInforme.congregacion_id = ambito.congregacion_id;

    this.informeService.crearInforme(nuevoInforme).subscribe(
      (respuesta: any) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El informe se ha generado correctamente.',
          icon: 'success',
        });
        const nuevoAmbito = {
          ...ambito,
          informe: respuesta.informe,
        };
        this.ambitos = this.ambitos.map((actual) =>
          actual.tipo_congregacion === ambito.tipo_congregacion &&
          actual.congregacion_id === ambito.congregacion_id
            ? nuevoAmbito
            : actual,
        );
        this.seleccionarInforme(nuevoAmbito);
      },
      (error) => {
        if (error.status === 409) {
          this.verificarInformeAbierto();
          return;
        }
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
    const informeId = this.informeService.informeActivoId;
    if (informeId) this.verInforme(informeId);
  }
}
