import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  AlertaDashboard,
  AlertasDashboard,
  ETIQUETAS_TIPO_ALERTA,
  ubicacionUnidad,
  FiltrosDashboard,
  NivelAlerta,
  TipoAlerta,
  UnidadRef,
} from 'src/app/core/interfaces/dashboard-supervision.interface';
import { DashboardSupervisionService } from 'src/app/services/dashboard-supervision/dashboard-supervision.service';

const ICONOS_ALERTA: Record<TipoAlerta, string> = {
  INFORME_PENDIENTE: 'fa-file-lines',
  DISMINUCION: 'fa-arrow-down',
  INCREMENTO: 'fa-arrow-up',
  TENDENCIA_DISMINUCION: 'fa-chart-line',
  TENDENCIA_CRECIMIENTO: 'fa-chart-line',
  ASUNTO_RECURRENTE: 'fa-rotate',
};

@Component({
  selector: 'app-alertas-supervision',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alertas-supervision.component.html',
  styleUrls: ['./alertas-supervision.component.scss'],
})
export class AlertasSupervisionComponent {
  private servicio = inject(DashboardSupervisionService);
  private destroyRef = inject(DestroyRef);

  filtros = input.required<FiltrosDashboard>();
  verUnidad = output<UnidadRef>();

  readonly etiquetas = ETIQUETAS_TIPO_ALERTA;
  readonly tipos = Object.keys(ETIQUETAS_TIPO_ALERTA) as TipoAlerta[];
  readonly iconos = ICONOS_ALERTA;
  private readonly tamanoBloque = 15;

  tipo = signal<TipoAlerta | ''>('');
  nivel = signal<NivelAlerta | ''>('');
  cargando = signal(false);
  error = signal<string | null>(null);
  respuesta = signal<AlertasDashboard | null>(null);
  visibles = signal(this.tamanoBloque);

  alertas = computed<AlertaDashboard[]>(() => (this.respuesta()?.alertas ?? []).slice(0, this.visibles()));
  hayMas = computed(() => (this.respuesta()?.alertas.length ?? 0) > this.visibles());
  totalGeneral = computed(() =>
    Object.values(this.respuesta()?.porTipo ?? {}).reduce((suma, n) => suma + n, 0),
  );

  private suscripcion?: Subscription;

  constructor() {
    effect(() => {
      const filtros = this.filtros();
      const tipo = this.tipo();
      const nivel = this.nivel();
      untracked(() => this.cargar(filtros, tipo, nivel));
    });
  }

  private cargar(filtros: FiltrosDashboard, tipo: string, nivel: string): void {
    this.suscripcion?.unsubscribe();
    this.cargando.set(true);
    this.error.set(null);
    this.suscripcion = this.servicio
      .getAlertas(filtros, tipo, nivel)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.respuesta.set(r);
          this.visibles.set(this.tamanoBloque);
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(e?.error?.msg ?? 'No fue posible cargar las alertas.');
          this.cargando.set(false);
        },
      });
  }

  seleccionarTipo(tipo: TipoAlerta | ''): void {
    this.tipo.set(this.tipo() === tipo ? '' : tipo);
  }

  verMas(): void {
    this.visibles.update((v) => v + this.tamanoBloque);
  }

  ubicacion(unidad: UnidadRef): string {
    return ubicacionUnidad(unidad);
  }
}
