import { Injectable, signal, computed } from '@angular/core';

/**
 * Interfaz para una operación de carga activa
 */
export interface LoadingOperation {
  id: string; // Identificador único del request
  label: string; // Mensaje a mostrar
  endpoint: string; // URL del endpoint
  startTime: number; // Timestamp de inicio
}

/**
 * Servicio global de loading/spinner para toda la aplicación.
 *
 * Características:
 * - Maneja múltiples requests concurrentes con contador
 * - Mensajes dinámicos basados en el endpoint
 * - Debounce para evitar parpadeos
 * - Tiempo mínimo de visualización
 * - Usa Signals para reactividad (Angular 17+)
 *
 * @example
 * // El servicio se usa automáticamente via LoadingInterceptor
 * // pero también puede usarse manualmente:
 * loadingService.show('custom-id', 'Procesando datos...');
 * // ...
 * loadingService.hide('custom-id');
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  // Configuración
  private readonly DEBOUNCE_TIME = 200; // ms - tiempo antes de mostrar el loading
  private readonly MIN_DISPLAY_TIME = 500; // ms - tiempo mínimo que debe estar visible
  private readonly MAX_LABELS_DISPLAY = 3; // Máximo de labels a mostrar en detalle

  // Estado reactivo con Signals
  private activeOperations = signal<Map<string, LoadingOperation>>(new Map());
  private debounceTimer: any = null;
  private minDisplayTimer: any = null;
  private loadingShownAt: number | null = null;

  /**
   * Signal: indica si hay operaciones activas (contador > 0)
   */
  public readonly hasActiveOperations = computed(() => this.activeOperations().size > 0);

  /**
   * Signal: indica si el loading está visible (después del debounce)
   */
  public readonly isLoading = signal<boolean>(false);

  /**
   * Signal: mensaje principal a mostrar
   */
  public readonly message = computed<string>(() => {
    const ops = Array.from(this.activeOperations().values());

    if (ops.length === 0) {
      return '';
    }

    if (ops.length === 1) {
      return ops[0].label;
    }

    // Múltiples operaciones: mostrar contador
    const labels = ops.slice(0, this.MAX_LABELS_DISPLAY).map((op) => this.extractShortLabel(op.label));
    const remaining = ops.length - this.MAX_LABELS_DISPLAY;

    if (remaining > 0) {
      return `Cargando (${ops.length})... ${labels.join(', ')} y ${remaining} más`;
    }

    return `Cargando (${ops.length})... ${labels.join(', ')}`;
  });

  /**
   * Signal: detalles de todas las operaciones activas
   */
  public readonly activeOperationsDetails = computed<LoadingOperation[]>(() => {
    return Array.from(this.activeOperations().values());
  });

  /**
   * Signal: contador de operaciones activas
   */
  public readonly activeCount = computed<number>(() => this.activeOperations().size);

  /**
   * Activa una operación de carga
   *
   * @param operationId - Identificador único de la operación
   * @param label - Mensaje a mostrar
   * @param endpoint - URL del endpoint (opcional)
   */
  show(operationId: string, label: string = 'Cargando...', endpoint: string = ''): void {
    const operation: LoadingOperation = {
      id: operationId,
      label,
      endpoint,
      startTime: Date.now(),
    };

    // Agregar operación al Map
    this.activeOperations.update((ops) => {
      const newOps = new Map(ops);
      newOps.set(operationId, operation);
      return newOps;
    });

    // Si es la primera operación, iniciar debounce
    if (this.activeOperations().size === 1 && !this.isLoading()) {
      this.startDebounceTimer();
    }
  }

  /**
   * Desactiva una operación de carga
   *
   * @param operationId - Identificador único de la operación
   */
  hide(operationId: string): void {
    // Remover operación del Map
    this.activeOperations.update((ops) => {
      const newOps = new Map(ops);
      newOps.delete(operationId);
      return newOps;
    });

    // Si no quedan operaciones y el loading está visible, aplicar tiempo mínimo
    if (this.activeOperations().size === 0 && this.isLoading()) {
      this.hideWithMinTime();
    }
  }

  /**
   * Oculta el loading respetando el tiempo mínimo de visualización
   */
  private hideWithMinTime(): void {
    if (this.loadingShownAt === null) {
      this.isLoading.set(false);
      return;
    }

    const elapsed = Date.now() - this.loadingShownAt;
    const remaining = this.MIN_DISPLAY_TIME - elapsed;

    if (remaining > 0) {
      // Esperar el tiempo restante
      this.minDisplayTimer = setTimeout(() => {
        this.isLoading.set(false);
        this.loadingShownAt = null;
      }, remaining);
    } else {
      // Ya pasó el tiempo mínimo
      this.isLoading.set(false);
      this.loadingShownAt = null;
    }
  }

  /**
   * Inicia el timer de debounce antes de mostrar el loading
   */
  private startDebounceTimer(): void {
    this.clearDebounceTimer();

    this.debounceTimer = setTimeout(() => {
      // Solo mostrar si aún hay operaciones activas
      if (this.activeOperations().size > 0) {
        this.isLoading.set(true);
        this.loadingShownAt = Date.now();
      }
    }, this.DEBOUNCE_TIME);
  }

  /**
   * Limpia el timer de debounce
   */
  private clearDebounceTimer(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Extrae una versión corta del label para mostrar en listas
   */
  private extractShortLabel(label: string): string {
    // Elimina palabras comunes del inicio
    return label
      .replace(/^(Cargando|Consultando|Guardando|Actualizando|Eliminando)\s*/i, '')
      .replace(/\.\.\.$/, '')
      .trim();
  }

  /**
   * Resetea todo el estado (útil para testing o casos excepcionales)
   */
  reset(): void {
    this.clearDebounceTimer();

    if (this.minDisplayTimer) {
      clearTimeout(this.minDisplayTimer);
      this.minDisplayTimer = null;
    }

    this.activeOperations.set(new Map());
    this.isLoading.set(false);
    this.loadingShownAt = null;
  }

  /**
   * Fuerza la ocultación inmediata del loading (sin respetar tiempo mínimo)
   * Solo usar en casos excepcionales como navegación o logout
   */
  forceHide(): void {
    this.clearDebounceTimer();

    if (this.minDisplayTimer) {
      clearTimeout(this.minDisplayTimer);
      this.minDisplayTimer = null;
    }

    this.activeOperations.set(new Map());
    this.isLoading.set(false);
    this.loadingShownAt = null;
  }
}
