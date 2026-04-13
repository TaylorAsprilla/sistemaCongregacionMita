import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { RUTAS } from 'src/app/routes/menu-items';
import Swal from 'sweetalert2';

const base_url = environment.base_url;

/**
 * Servicio para monitorear el estado de la sesión del usuario.
 *
 * Verifica periódicamente si la sesión sigue activa en el servidor
 * y maneja el caso cuando la sesión fue invalidada.
 *
 * @example
 * // En un componente o servicio que necesite monitorear la sesión:
 * this.sessionMonitorService.startMonitoring();
 *
 * // Para detener el monitoreo:
 * this.sessionMonitorService.stopMonitoring();
 */
@Injectable({
  providedIn: 'root',
})
export class SessionMonitorService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private monitoringSubscription: Subscription | null = null;
  private isMonitoring: boolean = false;

  /**
   * Intervalo de verificación en milisegundos (default: 45 segundos)
   * - No muy frecuente para no sobrecargar el servidor
   * - No muy lento para que el usuario no espere mucho
   */
  private readonly CHECK_INTERVAL_MS = 45 * 1000; // 45 segundos

  /**
   * Path del endpoint de verificación de sesión
   */
  private readonly CHECK_SESSION_ENDPOINT = `${base_url}/login/check-session`;

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  /**
   * Inicia el monitoreo periódico de la sesión.
   * Solo se puede tener un monitoreo activo a la vez.
   *
   * @param intervalMs - Intervalo de verificación en milisegundos (opcional)
   */
  startMonitoring(intervalMs: number = this.CHECK_INTERVAL_MS): void {
    // Si ya está monitoreando, no iniciar otro
    if (this.isMonitoring) {
      console.log('⚠️ SessionMonitor: Ya hay un monitoreo activo');
      return;
    }

    // Solo monitorear si hay token
    if (!this.token) {
      console.log('⚠️ SessionMonitor: No hay token, no se inicia monitoreo');
      return;
    }

    console.log(`✅ SessionMonitor: Iniciando monitoreo cada ${intervalMs / 1000}s`);
    this.isMonitoring = true;

    // Crear subscription que verifica periódicamente
    this.monitoringSubscription = interval(intervalMs)
      .pipe(
        switchMap(() => this.checkSession()),
        catchError((error) => {
          // Si hay un error, el interceptor de sesión lo manejará
          console.error('❌ SessionMonitor: Error verificando sesión', error);
          return [];
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.ok || response?.success) {
            console.log('✅ SessionMonitor: Sesión activa');
          }
        },
        error: (error) => {
          // Este caso no debería ocurrir gracias al catchError
          console.error('❌ SessionMonitor: Error inesperado', error);
        },
      });
  }

  /**
   * Detiene el monitoreo de la sesión.
   */
  stopMonitoring(): void {
    if (this.monitoringSubscription) {
      console.log('🛑 SessionMonitor: Deteniendo monitoreo');
      this.monitoringSubscription.unsubscribe();
      this.monitoringSubscription = null;
      this.isMonitoring = false;
    }
  }

  /**
   * Verifica si la sesión actual sigue siendo válida en el servidor.
   *
   * @returns Observable con la respuesta del servidor
   */
  checkSession() {
    return this.httpClient.get(this.CHECK_SESSION_ENDPOINT, this.headers);
  }

  /**
   * Verifica si el monitoreo está activo.
   */
  isActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * Limpia recursos cuando se destruye el servicio.
   */
  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}
