import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading/loading.service';

/**
 * Componente global de Loading/Spinner
 *
 * Muestra un overlay de carga cuando hay requests HTTP activos.
 * Se integra automáticamente con LoadingService y el interceptor HTTP.
 *
 * CARACTERÍSTICAS:
 * - Overlay fullscreen con backdrop
 * - Spinner animado personalizado
 * - Mensaje dinámico basado en el endpoint
 * - Soporte para múltiples requests concurrentes
 * - Debounce automático (no parpadea en requests rápidos)
 * - Tiempo mínimo de visualización (no flicker)
 * - Accesibilidad (aria-live, role="status")
 *
 * USO:
 * Este componente debe colocarse en AppComponent para estar siempre disponible:
 *
 * @example
 * // app.component.html
 * <app-global-loading></app-global-loading>
 * <router-outlet></router-outlet>
 *
 * NO requiere uso manual en componentes; funciona automáticamente
 * con el LoadingInterceptor en todos los requests HTTP.
 */
@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-loading.component.html',
  styleUrls: ['./global-loading.component.scss'],
})
export class GlobalLoadingComponent {
  private loadingService = inject(LoadingService);

  /**
   * Signal: indica si el loading está visible
   */
  isLoading = this.loadingService.isLoading;

  /**
   * Signal: mensaje principal a mostrar
   */
  message = this.loadingService.message;

  /**
   * Signal: contador de operaciones activas
   */
  activeCount = this.loadingService.activeCount;

  /**
   * Computed: indica si hay múltiples operaciones activas
   */
  hasMultipleOperations = computed(() => this.activeCount() > 1);

  /**
   * Computed: texto del contador para mostrar
   */
  counterText = computed(() => {
    const count = this.activeCount();
    return count > 1 ? `(${count})` : '';
  });
}
