import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CATEGORIAS_NOTIFICACION, NotificacionModel } from 'src/app/core/models/notificacion.model';
import { fechaHoraCompleta, tiempoRelativo, urlDestinoSegura } from 'src/app/core/utils/notificaciones';

/** Una notificación (título, mensaje, fecha, categoría y estado) reutilizada por la campana y la pantalla completa. */
@Component({
  selector: 'app-notificacion-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notificacion-item.component.html',
  styleUrls: ['./notificacion-item.component.scss'],
})
export class NotificacionItemComponent {
  notificacion = input.required<NotificacionModel>();
  /** Muestra la acción de eliminar (solo en la pantalla completa). */
  permitirEliminar = input(false);

  abrir = output<NotificacionModel>();
  marcarLeida = output<NotificacionModel>();
  eliminar = output<NotificacionModel>();

  protected categoria = computed(() => CATEGORIAS_NOTIFICACION[this.notificacion().categoria]);
  protected tiempo = computed(() => tiempoRelativo(this.notificacion().fechaCreacion));
  protected fechaCompleta = computed(() => fechaHoraCompleta(this.notificacion().fechaCreacion));
  protected tieneDestino = computed(() => urlDestinoSegura(this.notificacion().urlDestino) !== null);
}
