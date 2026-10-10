import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { FiltrosDashboard, InformesSupervision } from 'src/app/core/interfaces/dashboard-supervision.interface';
import { RUTAS } from 'src/app/routes/menu-items';
import { DashboardSupervisionService } from 'src/app/services/dashboard-supervision/dashboard-supervision.service';

@Component({
  selector: 'app-informes-obreros',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card mb-3" aria-labelledby="tituloInformesObreros">
      <div class="card-body">
        <h2 id="tituloInformesObreros" class="h5">Informes de todos los obreros</h2>
        <p class="small text-muted">
          Trimestre {{ filtros().trimestre }} de {{ filtros().anio }}. Informes abiertos y cerrados de los obreros
          a cargo de las congregaciones del alcance seleccionado. Usa los filtros de país, ciudad y campo del Dashboard.
        </p>
        <div class="d-flex flex-wrap gap-3 mb-3">
          <label class="flex-grow-1">
            Buscar obrero o número de informe
            <input #busquedaInput class="form-control" type="search" (input)="buscar(busquedaInput.value)" />
          </label>
          <label>
            Informes por página
            <select class="form-select" [ngModel]="porPagina()" (ngModelChange)="cambiarCantidad($event)">
              <option [ngValue]="10">10</option>
              <option [ngValue]="25">25</option>
              <option [ngValue]="50">50</option>
            </select>
          </label>
        </div>
        @if (error()) {
          <div class="alert alert-warning" role="alert">
            {{ error() }} <button class="btn btn-sm btn-outline-primary" (click)="recargar()">Reintentar</button>
          </div>
        } @else if (cargando()) {
          <p role="status">Cargando informes…</p>
        } @else if (datos(); as d) {
          <p class="small text-muted">{{ d.total }} informe(s)</p>
          <div class="table-responsive">
            <table class="table table-striped align-middle">
              <thead><tr><th>Informe</th><th>Obrero</th><th>Estado</th><th>Acción</th></tr></thead>
              <tbody>
                @for (informe of d.informes; track informe.id) {
                  <tr>
                    <td>#{{ informe.id }}</td>
                    <td>{{ informe.obrero || 'Usuario #' + informe.usuario_id }}</td>
                    <td>{{ informe.estado }}</td>
                    <td>
                      <a class="btn btn-sm btn-outline-primary"
                        [routerLink]="['/sistema', rutas.VER_INFORME, informe.id]"
                        [queryParams]="{ origen: rutas.DASHBOARD_SUPERVISION, anio: filtros().anio, trimestre: filtros().trimestre,
                          pais_id: filtros().pais_id, congregacion_id: filtros().congregacion_id, campo_id: filtros().campo_id }">
                        Ver informe completo
                      </a>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="text-center text-muted">No hay informes para esta consulta.</td></tr>
                }
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-outline-primary" [disabled]="d.pagina <= 1" (click)="pagina.set(d.pagina - 1)">Anterior</button>
            <span>Página {{ d.pagina }} de {{ d.totalPaginas }}</span>
            <button class="btn btn-sm btn-outline-primary" [disabled]="d.pagina >= d.totalPaginas" (click)="pagina.set(d.pagina + 1)">Siguiente</button>
          </div>
        }
      </div>
    </section>
  `,
})
export class InformesObrerosComponent {
  private servicio = inject(DashboardSupervisionService);
  private destroyRef = inject(DestroyRef);
  private busquedaEntrada = new Subject<string>();
  private suscripcion?: Subscription;
  readonly rutas = RUTAS;
  filtros = input.required<FiltrosDashboard>();
  datos = signal<InformesSupervision | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);
  busqueda = signal('');
  pagina = signal(1);
  porPagina = signal(10);

  constructor() {
    this.busquedaEntrada.pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((texto) => {
        this.pagina.set(1);
        this.busqueda.set(texto.trim());
      });
    let periodoAnterior = '';
    effect(() => {
      const filtros = this.filtros();
      const periodo = JSON.stringify([filtros.anio, filtros.trimestre, filtros.pais_id, filtros.congregacion_id, filtros.campo_id]);
      if (periodoAnterior !== periodo) untracked(() => this.pagina.set(1));
      periodoAnterior = periodo;
      const consulta = { busqueda: this.busqueda(), pagina: this.pagina(), porPagina: this.porPagina() };
      untracked(() => this.cargar(filtros, consulta));
    });
  }

  buscar(texto: string): void { this.busquedaEntrada.next(texto); }
  cambiarCantidad(cantidad: number): void {
    this.pagina.set(1);
    this.porPagina.set(cantidad);
  }
  recargar(): void {
    this.cargar(this.filtros(), { busqueda: this.busqueda(), pagina: this.pagina(), porPagina: this.porPagina() });
  }
  private cargar(filtros: FiltrosDashboard, consulta: { busqueda: string; pagina: number; porPagina: number }): void {
    this.suscripcion?.unsubscribe();
    this.cargando.set(true);
    this.error.set(null);
    this.suscripcion = this.servicio.getInformes(filtros, consulta)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => { this.datos.set(datos); this.cargando.set(false); },
        error: (e) => {
          this.error.set(e?.error?.msg ?? 'No fue posible cargar los informes de los obreros.');
          this.cargando.set(false);
        },
      });
  }
}
