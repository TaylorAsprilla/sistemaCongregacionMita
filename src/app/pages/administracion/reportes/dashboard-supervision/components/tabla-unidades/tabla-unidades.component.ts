import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  ETIQUETAS_ESTADO_ENTREGA,
  ETIQUETAS_TIPO_UNIDAD,
  EstadoEntrega,
  FiltrosDashboard,
  OrdenUnidades,
  TipoUnidad,
  UnidadRef,
  UnidadesDashboard,
  ubicacionUnidad,
} from 'src/app/core/interfaces/dashboard-supervision.interface';
import { DashboardSupervisionService } from 'src/app/services/dashboard-supervision/dashboard-supervision.service';
import { IndicadorVariacionComponent } from '../indicador-variacion/indicador-variacion.component';

@Component({
  selector: 'app-tabla-unidades',
  standalone: true,
  imports: [FormsModule, IndicadorVariacionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabla-unidades.component.html',
  styleUrls: ['./tabla-unidades.component.scss'],
})
export class TablaUnidadesComponent {
  private servicio = inject(DashboardSupervisionService);
  private destroyRef = inject(DestroyRef);

  filtros = input.required<FiltrosDashboard>();
  verUnidad = output<UnidadRef>();

  readonly etiquetasEstado = ETIQUETAS_ESTADO_ENTREGA;
  readonly etiquetasTipo = ETIQUETAS_TIPO_UNIDAD;
  readonly tipos = Object.keys(ETIQUETAS_TIPO_UNIDAD) as TipoUnidad[];
  readonly ubicacion = ubicacionUnidad;
  readonly estados = Object.keys(ETIQUETAS_ESTADO_ENTREGA) as EstadoEntrega[];
  readonly ordenes: { valor: OrdenUnidades; etiqueta: string }[] = [
    { valor: 'NOMBRE', etiqueta: 'Nombre (A-Z)' },
    { valor: 'PAIS', etiqueta: 'Congregación País' },
    { valor: 'CONGREGACION', etiqueta: 'Congregación Ciudad' },
    { valor: 'MAYOR_INCREMENTO', etiqueta: 'Mayor incremento de asistencia' },
    { valor: 'MAYOR_DISMINUCION', etiqueta: 'Mayor disminución de asistencia' },
    { valor: 'MAS_ALERTAS', etiqueta: 'Más alertas' },
  ];

  busqueda = signal('');
  tipo = signal<TipoUnidad | ''>('');
  estado = signal<EstadoEntrega | ''>('');
  orden = signal<OrdenUnidades>('NOMBRE');
  pagina = signal(1);
  porPagina = signal(10);

  cargando = signal(false);
  error = signal<string | null>(null);
  datos = signal<UnidadesDashboard | null>(null);

  private busquedaEntrada = new Subject<string>();
  private suscripcion?: Subscription;

  constructor() {
    this.busquedaEntrada
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((texto) => {
        this.pagina.set(1);
        this.busqueda.set(texto);
      });

    let filtrosPrevios: FiltrosDashboard | null = null;
    effect(() => {
      const filtros = this.filtros();
      if (filtrosPrevios !== null && filtrosPrevios !== filtros) {
        untracked(() => this.pagina.set(1));
      }
      filtrosPrevios = filtros;
      const consulta = {
        busqueda: this.busqueda().trim(),
        tipo: this.tipo(),
        estado: this.estado(),
        orden: this.orden(),
        pagina: this.pagina(),
        porPagina: this.porPagina(),
      };
      untracked(() => this.cargar(filtros, consulta));
    });
  }

  private cargar(filtros: FiltrosDashboard, consulta: Parameters<DashboardSupervisionService['getUnidades']>[1]): void {
    this.suscripcion?.unsubscribe();
    this.cargando.set(true);
    this.error.set(null);
    this.suscripcion = this.servicio
      .getUnidades(filtros, consulta)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.datos.set(r);
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(e?.error?.msg ?? 'No fue posible cargar las congregaciones.');
          this.cargando.set(false);
        },
      });
  }

  buscar(texto: string): void {
    this.busquedaEntrada.next(texto);
  }

  cambiar<T>(objetivo: { set: (v: T) => void }, valor: T): void {
    this.pagina.set(1);
    objetivo.set(valor);
  }

  irAPagina(pagina: number): void {
    const total = this.datos()?.totalPaginas ?? 1;
    if (pagina >= 1 && pagina <= total) this.pagina.set(pagina);
  }

  claseEstado(estado: EstadoEntrega): string {
    switch (estado) {
      case 'ENTREGADO':
        return 'bg-success';
      case 'EN_ELABORACION':
        return 'bg-info text-dark';
      case 'PENDIENTE':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }

  iconoEstado(estado: EstadoEntrega): string {
    switch (estado) {
      case 'ENTREGADO':
        return 'fa-check';
      case 'EN_ELABORACION':
        return 'fa-pencil';
      case 'PENDIENTE':
        return 'fa-clock';
      default:
        return 'fa-user-xmark';
    }
  }
}
