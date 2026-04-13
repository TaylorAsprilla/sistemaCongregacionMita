import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { SessionErrorCode, SessionErrorResponse, getSessionErrorMessage } from '../../enums/session-error.enum';
import { RUTAS } from 'src/app/routes/menu-items';

/**
 * Interceptor funcional para manejar errores de sesión invalidada.
 *
 * Detecta errores HTTP 401 con códigos específicos de sesión:
 * - SESSION_REPLACED: Usuario inició sesión desde otro lugar
 * - SESSION_NOT_FOUND: La sesión no existe en el servidor
 * - SESSION_EXPIRED: Sesión expiró por inactividad
 * - TOKEN_EXPIRED: Token JWT expiró
 * - NO_TOKEN: No se envió token en la petición
 *
 * Compatible con ambos formatos de respuesta del backend:
 * - {ok: false, code: "...", msg: "..."}
 * - {success: false, code: "...", message: "..."}
 *
 * Cuando se detecta un error de sesión:
 * 1. Muestra un mensaje amigable al usuario (SweetAlert2)
 * 2. Limpia el almacenamiento local (token, datos del usuario)
 * 3. Redirige al login con parámetro sessionClosed
 *
 * @example
 * // En app.config.ts
 * provideHttpClient(
 *   withInterceptors([sessionInterceptor, loadingInterceptor])
 * )
 */
export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo procesar errores 401 (Unauthorized)
      if (error.status === 401) {
        const errorResponse = error.error as SessionErrorResponse;

        // Verificar si es un error de sesión con código específico
        if (errorResponse?.code && Object.values(SessionErrorCode).includes(errorResponse.code)) {
          handleSessionError(errorResponse.code, router, errorResponse);

          // No propagar el error después de manejarlo
          // (opcional: puedes propagar si necesitas que otros interceptores lo procesen)
          return throwError(() => error);
        }
      }

      // Para cualquier otro error, propagar normalmente
      return throwError(() => error);
    }),
  );
};

/**
 * Maneja el error de sesión: muestra mensaje, limpia storage y redirige
 */
function handleSessionError(code: SessionErrorCode, router: Router, errorResponse?: SessionErrorResponse): void {
  // Para SESSION_NOT_FOUND y NO_TOKEN, redirigir directamente sin mostrar modal
  if (code === SessionErrorCode.SESSION_NOT_FOUND || code === SessionErrorCode.NO_TOKEN) {
    clearSessionAndRedirect(router, code);
    return;
  }

  // Para SESSION_REPLACED sin información de nueva sesión, redirigir directamente
  if (code === SessionErrorCode.SESSION_REPLACED && !errorResponse?.newSessionInfo) {
    clearSessionAndRedirect(router, code);
    return;
  }

  const { title, message, icon } = getSessionErrorMessage(code, errorResponse);

  // Mostrar mensaje al usuario con auto-cierre a los 10 segundos
  Swal.fire({
    title,
    html: message,
    icon,
    confirmButtonText: 'Iniciar sesión ahora',
    allowOutsideClick: false,
    allowEscapeKey: false,
    width: '600px',
    timer: 10000, // Auto-cerrar después de 10 segundos
    timerProgressBar: true, // Mostrar barra de progreso
    didOpen: () => {
      // Mostrar contador en el botón
      const confirmButton = Swal.getConfirmButton();
      if (confirmButton) {
        let secondsLeft = 10;
        const interval = setInterval(() => {
          secondsLeft--;
          if (secondsLeft > 0) {
            confirmButton.textContent = `Iniciar sesión ahora (${secondsLeft}s)`;
          } else {
            clearInterval(interval);
          }
        }, 1000);
      }
    },
    customClass: {
      popup: 'session-error-modal',
      htmlContainer: 'text-start',
    },
  }).then(() => {
    // Se ejecuta tanto si el usuario hace clic como si expira el timer
    clearSessionAndRedirect(router, code);
  });
}

/**
 * Limpia el almacenamiento local y redirige al login
 */
function clearSessionAndRedirect(router: Router, code: SessionErrorCode): void {
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('menu');
  localStorage.removeItem('permissions');

  // Limpiar sessionStorage
  sessionStorage.clear();

  // Redirigir al login sin parámetros
  router.navigate([RUTAS.LOGIN]);
}
