import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DetalleUnidad,
  ETIQUETAS_ESTADO_ENTREGA,
  ETIQUETAS_TIPO_UNIDAD,
  ubicacionUnidad,
  FiltrosDashboard,
  GrupoIndicador,
  UnidadRef,
} from 'src/app/core/interfaces/dashboard-supervision.interface';
import { DashboardSupervisionService } from 'src/app/services/dashboard-supervision/dashboard-supervision.service';
import { GraficaTendenciasComponent } from '../grafica-tendencias/grafica-tendencias.component';
import { IndicadorVariacionComponent } from '../indicador-variacion/indicador-variacion.component';

@Component({
  selector: 'app-detalle-unidad',
  standalone: true,
  imports: [DecimalPipe, DatePipe, IndicadorVariacionComponent, GraficaTendenciasComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-unidad.component.html',
  styleUrls: ['./detalle-unidad.component.scss'],
})
export class DetalleUnidadComponent {
  private servicio = inject(DashboardSupervisionService);
  private destroyRef = inject(DestroyRef);

  unidad = input.required<UnidadRef>();
  filtros = input.required<FiltrosDashboard>();
  cerrar = output<void>();

  readonly etiquetasEstado = ETIQUETAS_ESTADO_ENTREGA;
  readonly etiquetasTipo = ETIQUETAS_TIPO_UNIDAD;
  readonly grupos: { clave: GrupoIndicador; titulo: string; icono: string }[] = [
    { clave: 'ASISTENCIA', titulo: 'Asistencia', icono: 'fa-users' },
    { clave: 'VIDA_ESPIRITUAL', titulo: 'Vida espiritual', icono: 'fa-heart' },
    { clave: 'TRABAJO_PASTORAL', titulo: 'Trabajo pastoral', icono: 'fa-handshake' },
    { clave: 'ADMINISTRACION', titulo: 'Administración', icono: 'fa-folder-open' },
  ];

  cargando = signal(true);
  error = signal<string | null>(null);
  detalle = signal<DetalleUnidad | null>(null);

  ubicacion = computed(() => {
    const u = this.unidad();
    return ubicacionUnidad(u);
  });

  indicadoresPorGrupo = computed(() => {
    const indicadores = this.detalle()?.indicadores ?? [];
    return this.grupos
      .map((g) => ({ ...g, indicadores: indicadores.filter((i) => i.grupo === g.clave) }))
      .filter((g) => g.indicadores.length);
  });

  constructor() {
    effect(() => {
      const unidad = this.unidad();
      const filtros = this.filtros();
      untracked(() => this.cargar(unidad, filtros));
    });
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    this.cerrar.emit();
  }

  private cargar(unidad: UnidadRef, filtros: FiltrosDashboard): void {
    this.cargando.set(true);
    this.error.set(null);
    this.servicio
      .getDetalleUnidad(filtros, unidad.tipo, unidad.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (d) => {
          this.detalle.set(d);
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(e?.error?.msg ?? 'No fue posible cargar el detalle de la congregación.');
          this.cargando.set(false);
        },
      });
  }
}
