import { Injectable, inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { interval, Observable, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { RUTAS } from 'src/app/routes/menu-items';
import Swal from 'sweetalert2';
import { ActiveSessionsResponse } from 'src/app/core/interfaces/active-sessions.interface';
import { SKIP_LOADING } from '../interceptors/loading/loading.interceptor';

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
export class SessionMonitorService implements OnDestroy {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private monitoringSubscription: Subscription | null = null;
  private isMonitoring: boolean = false;
  private sessionWasActive: boolean = true;

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
   * Opciones HTTP incluyendo headers y contexto para omitir loading
   */
  get httpOptions() {
    return {
      headers: {
        'x-token': this.token,
      },
      context: new HttpContext().set(SKIP_LOADING, true),
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
      return;
    }

    // Solo monitorear si hay token
    if (!this.token) {
      return;
    }

    this.isMonitoring = true;
    this.sessionWasActive = true;

    // Crear subscription que verifica periódicamente
    this.monitoringSubscription = interval(intervalMs)
      .pipe(
        switchMap(() => this.checkSession()),
        catchError((error) => {
          // Si la sesión fue cerrada remotamente (401)
          if (error.status === 401 && this.sessionWasActive) {
            this.handleRemoteSessionClosure(error);
          }
          return [];
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.ok || response?.success) {
            this.sessionWasActive = true;
          } else if (response?.sessionClosed) {
            // El backend indica que la sesión fue cerrada remotamente
            this.handleRemoteSessionClosure(response);
          }
        },
        error: (error) => {
          // Verificar si es un cierre remoto de sesión
          if (error.status === 401 && this.sessionWasActive) {
            this.handleRemoteSessionClosure(error);
          }
        },
      });
  }

  /**
   * Maneja el caso cuando la sesión fue cerrada remotamente
   */
  private handleRemoteSessionClosure(data: any): void {
    this.sessionWasActive = false;
    this.stopMonitoring();

    // Extraer información del nuevo inicio de sesión
    // El data puede venir directamente o dentro de error.error
    const newSessionInfo = data?.newSessionInfo || data?.error?.newSessionInfo || {};
    const location = newSessionInfo.location || {};
    const device = newSessionInfo.device || {};

    // Ubicación
    const ciudad = location.ciudad || 'Ubicación desconocida';
    const region = location.region || '';
    const pais = location.pais || '';
    let ubicacionCompleta = ciudad;
    if (region) ubicacionCompleta += `, ${region}`;
    if (pais) ubicacionCompleta += `, ${pais}`;

    // Dispositivo
    const navegador = device.navegador || 'Navegador desconocido';
    const sistemaOperativo = device.so || 'SO desconocido';
    const tipoDispositivo = device.tipoDispositivo || 'desktop';

    // Icono según tipo de dispositivo
    const iconoDispositivo = tipoDispositivo === 'mobile' ? '📱' : tipoDispositivo === 'tablet' ? '📲' : '💻';

    // Información adicional (opcional)
    const ip = newSessionInfo.ip || '';
    const isp = newSessionInfo.isp || '';

    // Mensaje personalizado del backend (si existe)
    const mensaje =
      data?.message ||
      data?.error?.message ||
      'Tu sesión ha sido cerrada porque se inició sesión en una nueva ubicación o dispositivo.';

    Swal.fire({
      title: '🔒 Sesión Cerrada',
      html: `
        <div style="text-align: left;">
          <p><strong>${mensaje}</strong></p>
          <br>

          <!-- Ubicación -->
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid #667eea; margin-bottom: 12px;">
            <p style="margin: 0;"><strong>📍 Nueva ubicación:</strong></p>
            <p style="margin: 4px 0; color: #495057;">${ubicacionCompleta}</p>
          </div>

          <!-- Dispositivo -->
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid #764ba2; margin-bottom: 12px;">
            <p style="margin: 0;"><strong>${iconoDispositivo} Dispositivo:</strong></p>
            <p style="margin: 4px 0; color: #495057;">${navegador} en ${sistemaOperativo}</p>
          </div>

          ${
            ip
              ? `
          <!-- Información adicional -->
          <div style="background: #fff3cd; padding: 10px; border-radius: 6px; margin-bottom: 12px;">
            <p style="margin: 0; font-size: 0.85em; color: #856404;">
              <strong>IP:</strong> ${ip}${isp ? ` (${isp})` : ''}
            </p>
          </div>
          `
              : ''
          }

          <p style="font-size: 0.85em; color: #6c757d; margin-top: 12px;">
            <em>Nota: La ubicación mostrada es aproximada y se basa en la dirección IP.</em>
          </p>
        </div>
      `,
      icon: 'warning',
      confirmButtonColor: '#667eea',
      confirmButtonText: 'Cerrar',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      // Limpiar y redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('menu');
      localStorage.removeItem('permissions');
      sessionStorage.clear();
      this.router.navigateByUrl('/login');
    });
  }

  /**
   * Detiene el monitoreo de la sesión.
   */
  stopMonitoring(): void {
    if (this.monitoringSubscription) {
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
    return this.httpClient.get(this.CHECK_SESSION_ENDPOINT, this.httpOptions);
  }

  /**
   * Verifica si el monitoreo está activo.
   */
  isActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * Obtiene todas las sesiones activas en el sistema.
   *
   * @param limit - Número máximo de sesiones a retornar (default: 50)
   * @param offset - Número de sesiones a saltar para paginación (default: 0)
   * @returns Observable con la respuesta que contiene las sesiones activas
   */
  getActiveSessions(limit: number = 50, offset: number = 0): Observable<ActiveSessionsResponse> {
    const url = `${base_url}/login/active-sessions?limit=${limit}&offset=${offset}`;
    return this.httpClient.get<ActiveSessionsResponse>(url, this.httpOptions);
  }

  /**
   * Cierra todas las sesiones activas del usuario actual excepto la actual.
   * Útil para cuando el usuario quiere iniciar sesión en un nuevo dispositivo.
   *
   * @returns Observable con la respuesta del servidor
   */
  closeOtherSessions(): Observable<any> {
    const url = `${base_url}/login/close-other-sessions`;
    return this.httpClient.post(url, {}, this.httpOptions);
  }

  /**
   * Verifica si hay sesiones activas para continuar con el login.
   * Si hay sesiones, retorna la información para mostrar al usuario.
   *
   * @param credentials - Credenciales de login (sin hacer login aún)
   * @returns Observable con información de sesiones activas
   */
  checkActiveSessionsBeforeLogin(credentials: { login: string; password: string }): Observable<any> {
    const url = `${base_url}/login/check-sessions-before-login`;
    return this.httpClient.post(url, credentials);
  }

  /**
   * Limpia recursos cuando se destruye el servicio.
   */
  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}
