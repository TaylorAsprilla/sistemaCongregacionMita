import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import {
  ClaveServicio,
  FiltroVariacion,
  FiltrosDashboard,
  FiltrosDisponibles,
  GRUPOS_VARIACION,
  GrupoIndicador,
  Indicador,
  ResumenDashboard,
  TendenciasDashboard,
  UnidadRef,
} from 'src/app/core/interfaces/dashboard-supervision.interface';
import { DashboardSupervisionExportService } from 'src/app/services/dashboard-supervision/dashboard-supervision-export.service';
import { DashboardSupervisionService } from 'src/app/services/dashboard-supervision/dashboard-supervision.service';
import { AlertasSupervisionComponent } from './components/alertas-supervision/alertas-supervision.component';
import { DetalleUnidadComponent } from './components/detalle-unidad/detalle-unidad.component';
import { FiltrosSupervisionComponent } from './components/filtros-supervision/filtros-supervision.component';
import { GraficaTendenciasComponent } from './components/grafica-tendencias/grafica-tendencias.component';
import { IndicadorVariacionComponent } from './components/indicador-variacion/indicador-variacion.component';
import { TablaUnidadesComponent } from './components/tabla-unidades/tabla-unidades.component';

const ICONOS_INDICADOR: Record<string, string> = {
  asistenciaGeneral: 'fa-users',
  promedioAsistenciaServicio: 'fa-chart-column',
  serviciosRealizados: 'fa-calendar-check',
  visitasTotales: 'fa-house',
  actividadesEspirituales: 'fa-heart',
};

@Component({
  selector: 'app-dashboard-supervision',
  standalone: true,
  imports: [
    DecimalPipe,
    NgTemplateOutlet,
    FiltrosSupervisionComponent,
    IndicadorVariacionComponent,
    GraficaTendenciasComponent,
    AlertasSupervisionComponent,
    TablaUnidadesComponent,
    DetalleUnidadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-supervision.component.html',
  styleUrls: ['./dashboard-supervision.component.scss'],
})
export class DashboardSupervisionComponent {
  private servicio = inject(DashboardSupervisionService);
  private exportador = inject(DashboardSupervisionExportService);
  private destroyRef = inject(DestroyRef);

  disponibles = signal<FiltrosDisponibles | null>(null);
  filtros = signal<FiltrosDashboard | null>(null);
  resumen = signal<ResumenDashboard | null>(null);
  tendencias = signal<TendenciasDashboard | null>(null);

  cargandoInicial = signal(true);
  cargando = signal(false);
  exportando = signal<'excel' | 'pdf' | null>(null);
  error = signal<string | null>(null);
  unidadSeleccionada = signal<UnidadRef | null>(null);
  solicitudVariacion = signal<{ servicio: ClaveServicio; variacion: FiltroVariacion } | null>(null);

  readonly gruposVariacion = GRUPOS_VARIACION;

  /** Aplica en la tabla de congregaciones el servicio y la variación elegidos en el resumen. */
  verVariacion(servicio: ClaveServicio, variacion: FiltroVariacion): void {
    this.solicitudVariacion.set({ servicio, variacion });
    setTimeout(() =>
      document.getElementById('seccionCongregaciones')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  }

  private suscripcion?: Subscription;

  readonly coberturaTarjetas = computed(() => {
    const c = this.resumen()?.cobertura;
    if (!c) return [];
    return [
      { etiqueta: 'Congregaciones', valor: c.unidades, icono: 'fa-sitemap', clase: 'primario', ayuda: `País ${c.porTipo.PAIS} · Ciudad ${c.porTipo.CONGREGACION} · Campo ${c.porTipo.CAMPO}` },
      { etiqueta: 'Entregados', valor: c.entregados, icono: 'fa-circle-check', clase: 'exito', ayuda: 'Informes cerrados' },
      { etiqueta: 'En elaboración', valor: c.enElaboracion, icono: 'fa-pen-to-square', clase: 'info', ayuda: 'Informes abiertos' },
      { etiqueta: 'Pendientes', valor: c.pendientes, icono: 'fa-clock', clase: 'aviso', ayuda: 'Sin informe del periodo' },
      { etiqueta: 'Sin obrero', valor: c.sinObrero, icono: 'fa-user-xmark', clase: 'neutro', ayuda: 'Congregaciones sin obrero asignado' },
    ];
  });

  readonly indicadoresClave = computed(() => {
    const porClave = new Map((this.resumen()?.indicadores ?? []).map((i) => [i.clave, i]));
    return Object.keys(ICONOS_INDICADOR)
      .map((clave) => porClave.get(clave))
      .filter((i): i is Indicador => !!i);
  });
  readonly indicadoresEspirituales = computed(() => this.porGrupo('VIDA_ESPIRITUAL'));
  readonly indicadoresPastorales = computed(() => this.porGrupo('TRABAJO_PASTORAL'));
  readonly indicadoresAdministracion = computed(() => this.porGrupo('ADMINISTRACION'));

  readonly alcance = computed(() => {
    const f = this.filtros();
    const d = this.disponibles();
    if (!f || !d) return '';
    const nombre = (lista: { id: number; nombre: string }[], id: number | null) =>
      lista.find((x) => x.id === id)?.nombre ?? String(id);
    if (f.campo_id) return `Congregación Campo: ${nombre(d.campos, f.campo_id)}`;
    if (f.congregacion_id) return `Congregación Ciudad: ${nombre(d.congregaciones, f.congregacion_id)}`;
    if (f.pais_id) return `Congregación País: ${nombre(d.paises, f.pais_id)}`;
    return 'Todas las congregaciones';
  });

  constructor() {
    this.servicio
      .getFiltros()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (d) => {
          this.disponibles.set(d);
          this.filtros.set({
            anio: d.periodoActivo.anio,
            trimestre: d.periodoActivo.trimestre,
            pais_id: null,
            congregacion_id: null,
            campo_id: null,
            comparacion: 'TRIMESTRE_ANTERIOR',
          });
          this.cargandoInicial.set(false);
        },
        error: (e) => {
          this.error.set(e?.error?.msg ?? 'No fue posible cargar el dashboard de supervisión.');
          this.cargandoInicial.set(false);
        },
      });

    effect(() => {
      const filtros = this.filtros();
      if (filtros) untracked(() => this.cargar(filtros));
    });
  }

  private porGrupo(grupo: GrupoIndicador): Indicador[] {
    return (this.resumen()?.indicadores ?? []).filter((i) => i.grupo === grupo);
  }

  private cargar(filtros: FiltrosDashboard): void {
    this.suscripcion?.unsubscribe();
    this.cargando.set(true);
    this.error.set(null);
    this.suscripcion = forkJoin({
      resumen: this.servicio.getResumen(filtros),
      tendencias: this.servicio.getTendencias(filtros),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ resumen, tendencias }) => {
          this.resumen.set(resumen);
          this.tendencias.set(tendencias);
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(e?.error?.msg ?? 'No fue posible cargar la información con los filtros seleccionados.');
          this.cargando.set(false);
        },
      });
  }

  aplicarFiltros(filtros: FiltrosDashboard): void {
    this.filtros.set({ ...filtros });
  }

  icono(clave: string): string {
    return ICONOS_INDICADOR[clave] ?? 'fa-circle';
  }

  async exportar(formato: 'excel' | 'pdf'): Promise<void> {
    const filtros = this.filtros();
    if (!filtros || this.exportando()) return;
    this.exportando.set(formato);
    try {
      if (formato === 'excel') {
        await this.exportador.exportarExcel(filtros, this.alcance());
      } else {
        await this.exportador.exportarPdf(filtros, this.alcance());
      }
    } catch (e) {
      console.error('Error al exportar el dashboard de supervisión:', e);
      Swal.fire({ title: 'Error', text: 'No se pudo generar el archivo. Intente nuevamente.', icon: 'error' });
    } finally {
      this.exportando.set(null);
    }
  }
}
