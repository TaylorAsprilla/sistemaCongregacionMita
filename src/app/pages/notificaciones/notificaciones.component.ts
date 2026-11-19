import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CATEGORIAS_NOTIFICACION,
  CategoriaNotificacion,
  EstadoFiltroNotificacion,
  ListaNotificaciones,
  NotificacionModel,
} from 'src/app/core/models/notificacion.model';
import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { NotificacionItemComponent } from 'src/app/shared/notificacion-item/notificacion-item.component';

const POR_PAGINA = 15;

/** Pantalla "Mis notificaciones": historial con filtros por estado y categoría, y paginación. */
@Component({
  selector: 'app-notificaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificacionItemComponent],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {
  private servicio = inject(NotificacionService);
  private destroyRef = inject(DestroyRef);

  protected estado = signal<EstadoFiltroNotificacion>('todas');
  protected categoria = signal<CategoriaNotificacion | ''>('');
  protected pagina = signal(1);

  protected lista = signal<ListaNotificaciones | null>(null);
  protected cargando = signal(false);
  protected error = signal(false);

  protected noLeidas = this.servicio.noLeidas;
  protected categorias = Object.entries(CATEGORIAS_NOTIFICACION).map(([valor, datos]) => ({
    valor: valor as CategoriaNotificacion,
    etiqueta: datos.etiqueta,
  }));

  protected paginas = computed(() => {
    const total = this.lista()?.totalPaginas ?? 1;
    const actual = this.pagina();
    const inicio = Math.max(1, Math.min(actual - 2, total - 4));
    const fin = Math.min(total, inicio + 4);
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.servicio
      .listar({
        estado: this.estado(),
        categoria: this.categoria(),
        pagina: this.pagina(),
        porPagina: POR_PAGINA,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (respuesta) => {
          this.lista.set(respuesta);
          this.servicio.noLeidas.set(respuesta.noLeidas);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set(true);
          this.cargando.set(false);
        },
      });
  }

  protected cambiarEstado(estado: EstadoFiltroNotificacion): void {
    this.estado.set(estado);
    this.pagina.set(1);
    this.cargar();
  }

  protected cambiarCategoria(valor: string): void {
    this.categoria.set(valor as CategoriaNotificacion | '');
    this.pagina.set(1);
    this.cargar();
  }

  protected irAPagina(pagina: number): void {
    const total = this.lista()?.totalPaginas ?? 1;
    if (pagina < 1 || pagina > total || pagina === this.pagina()) return;
    this.pagina.set(pagina);
    this.cargar();
  }

  protected abrir(notificacion: NotificacionModel): void {
    if (!notificacion.leida) this.reflejarLectura(notificacion.id);
    this.servicio.abrir(notificacion);
  }

  protected marcarLeida(notificacion: NotificacionModel): void {
    this.servicio.marcarLeida(notificacion.id).subscribe({
      next: () => this.reflejarLectura(notificacion.id),
      error: () => undefined,
    });
  }

  protected marcarTodas(): void {
    this.servicio.marcarTodasLeidas().subscribe({ next: () => this.cargar(), error: () => undefined });
  }

  protected eliminar(notificacion: NotificacionModel): void {
    this.servicio.eliminar(notificacion.id).subscribe({ next: () => this.cargar(), error: () => undefined });
  }

  private reflejarLectura(id: number): void {
    this.lista.update((actual) =>
      actual
        ? { ...actual, notificaciones: actual.notificaciones.map((n) => (n.id === id ? { ...n, leida: true } : n)) }
        : actual,
    );
  }
}
