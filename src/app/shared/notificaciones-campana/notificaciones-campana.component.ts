import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NotificacionModel } from 'src/app/core/models/notificacion.model';
import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { RUTAS } from 'src/app/routes/menu-items';
import { NotificacionItemComponent } from '../notificacion-item/notificacion-item.component';

type Pestana = 'todas' | 'no-leidas' | 'leidas';

/**
 * Campana de notificaciones de la barra superior: contador de no leídas, panel con las más recientes,
 * filtros leídas / no leídas, acciones rápidas y acceso a la pantalla "Mis notificaciones".
 */
@Component({
  selector: 'li[app-notificaciones-campana]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NotificacionItemComponent],
  templateUrl: './notificaciones-campana.component.html',
  styleUrls: ['./notificaciones-campana.component.scss'],
  host: { class: 'nav-item notificaciones' },
})
export class NotificacionesCampanaComponent implements OnInit, OnDestroy {
  protected servicio = inject(NotificacionService);
  private router = inject(Router);

  protected pestana = signal<Pestana>('todas');
  protected animando = signal(false);
  private temporizadorAnimacion: ReturnType<typeof setTimeout> | undefined;

  protected noLeidas = this.servicio.noLeidas;
  protected etiquetaContador = computed(() => (this.noLeidas() > 99 ? '99+' : String(this.noLeidas())));
  protected etiquetaAria = computed(() =>
    this.noLeidas() > 0 ? `Notificaciones: ${this.noLeidas()} sin leer` : 'Notificaciones: no hay pendientes',
  );

  protected visibles = computed(() => {
    const lista = this.servicio.recientes();
    switch (this.pestana()) {
      case 'no-leidas':
        return lista.filter((n) => !n.leida);
      case 'leidas':
        return lista.filter((n) => n.leida);
      default:
        return lista;
    }
  });

  private ultimaAnimacion = 0;

  constructor() {
    // Animación discreta (campana) solo cuando llegan notificaciones nuevas, nunca en la carga inicial.
    effect(() => {
      const llegadas = this.servicio.llegadas();
      untracked(() => {
        if (llegadas > this.ultimaAnimacion) this.animar();
        this.ultimaAnimacion = llegadas;
      });
    });
  }

  ngOnInit(): void {
    this.servicio.iniciarSondeo();
  }

  ngOnDestroy(): void {
    clearTimeout(this.temporizadorAnimacion);
    this.servicio.detenerSondeo();
  }

  private animar(): void {
    this.animando.set(true);
    clearTimeout(this.temporizadorAnimacion);
    this.temporizadorAnimacion = setTimeout(() => this.animando.set(false), 1600);
  }

  protected alAbrirPanel(abierto: boolean): void {
    if (abierto) void this.servicio.cargarRecientes();
  }

  protected cambiarPestana(pestana: Pestana): void {
    this.pestana.set(pestana);
  }

  protected abrir(notificacion: NotificacionModel, panel: NgbDropdown): void {
    if (this.servicio.abrir(notificacion)) panel.close();
  }

  protected marcarLeida(notificacion: NotificacionModel): void {
    this.servicio.marcarLeida(notificacion.id).subscribe({ error: () => undefined });
  }

  protected marcarTodas(): void {
    this.servicio.marcarTodasLeidas().subscribe({ error: () => undefined });
  }

  protected verTodas(panel: NgbDropdown): void {
    panel.close();
    void this.router.navigate(['/', RUTAS.SISTEMA, RUTAS.NOTIFICACIONES]);
  }
}
