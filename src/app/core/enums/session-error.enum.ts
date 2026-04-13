/**
 * Códigos de error de sesión retornados por el backend
 * cuando se detecta una sesión inválida o expirada.
 */
export enum SessionErrorCode {
  /**
   * El usuario inició sesión desde otro dispositivo o navegador.
   * Solo se permite una sesión activa a la vez.
   */
  SESSION_REPLACED = 'SESSION_REPLACED',

  /**
   * La sesión no existe en la base de datos del servidor.
   * Puede ocurrir si la sesión fue eliminada manualmente.
   */
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',

  /**
   * La sesión expiró por inactividad.
   * El tiempo máximo de inactividad se configura en el backend.
   */
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  /**
   * El token JWT expiró.
   * El token tiene un tiempo de vida limitado configurado en el backend.
   */
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  /**
   * No se envió token en la petición.
   * El usuario debe iniciar sesión.
   */
  NO_TOKEN = 'NO_TOKEN',
}

/**
 * Interfaz para la respuesta de error de sesión del backend.
 * Compatible con ambos formatos: {ok: false} y {success: false}
 */
export interface SessionErrorResponse {
  ok?: false;
  success?: false;
  code: SessionErrorCode;
  msg?: string;
  message?: string;
  // Información de la nueva sesión (para SESSION_REPLACED)
  newSessionInfo?: {
    // Formato nuevo (con estructura anidada)
    location?: {
      pais?: string;
      ciudad?: string;
      region?: string;
    };
    device?: {
      navegador?: string;
      so?: string;
      dispositivo?: string;
      tipoDispositivo?: string;
    };
    ip?: string;
    isp?: string;
    createdAt?: string;

    // Formato legacy (retrocompatibilidad)
    dispositivo?: string;
    ciudad?: string;
    pais?: string;
    fechaInicio?: string;
  };
}

/**
 * Obtiene el mensaje amigable para mostrar al usuario según el código de error
 */
export function getSessionErrorMessage(
  code: SessionErrorCode,
  errorResponse?: SessionErrorResponse,
): {
  title: string;
  message: string;
  icon: 'warning' | 'info' | 'error';
} {
  switch (code) {
    case SessionErrorCode.SESSION_REPLACED:
      // Construir mensaje con información de ubicación si está disponible
      let locationInfo = '';
      if (errorResponse?.newSessionInfo) {
        const info = errorResponse.newSessionInfo;
        const parts: string[] = [];

        // Extraer ubicación (soporta ambos formatos)
        const ciudad = info.location?.ciudad || info.ciudad;
        const pais = info.location?.pais || info.pais;

        // Construir texto del dispositivo
        let dispositivoTexto = '';
        if (info.device) {
          const { navegador, so, tipoDispositivo } = info.device;

          // Formatear tipo de dispositivo
          const tipoFormateado = tipoDispositivo
            ? tipoDispositivo.charAt(0).toUpperCase() + tipoDispositivo.slice(1)
            : '';

          if (navegador && so) {
            dispositivoTexto = `${navegador} en ${so}`;
            if (tipoFormateado) {
              dispositivoTexto = `${tipoFormateado} - ${dispositivoTexto}`;
            }
          } else if (so) {
            dispositivoTexto = tipoFormateado ? `${tipoFormateado} - ${so}` : so;
          } else if (navegador) {
            dispositivoTexto = navegador;
          }
        } else if (info.dispositivo) {
          // Formato legacy
          dispositivoTexto = info.dispositivo;
        }

        // Agregar dispositivo si existe
        if (dispositivoTexto) {
          parts.push(`<strong>${dispositivoTexto}</strong>`);
        }

        // Agregar ubicación
        if (ciudad && pais) {
          parts.push(`${ciudad}, ${pais}`);
        } else if (pais) {
          parts.push(pais);
        }

        if (parts.length > 0) {
          locationInfo = `
            <div class="location-info-box">
              <p class="mb-2">
                <strong><i class="fas fa-map-marker-alt"></i>Nueva sesión iniciada desde:</strong>
              </p>
              <p class="mb-0 location-details">
                ${parts.join(' • ')}
              </p>
            </div>
          `;
        }
      }

      return {
        title: '⚠️ Sesión cerrada',
        message: `
          <div class="text-start">
            <p class="mb-3">
              Has iniciado sesión desde otro dispositivo o navegador.
              Esta sesión ha sido cerrada automáticamente por seguridad.
            </p>
            ${locationInfo}
            <div class="security-alert">
              <i class="fas fa-shield-alt"></i>
              <strong>¿No fuiste tú?</strong>
              <p>Si no reconoces este inicio de sesión, cambia tu contraseña inmediatamente para proteger tu cuenta.</p>
            </div>
          </div>
        `,
        icon: 'warning',
      };

    case SessionErrorCode.SESSION_EXPIRED:
    case SessionErrorCode.TOKEN_EXPIRED:
      return {
        title: '⏱️ Sesión expirada',
        message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        icon: 'info',
      };

    case SessionErrorCode.SESSION_NOT_FOUND:
      return {
        title: '❌ Sesión inválida',
        message: 'Tu sesión no es válida. Por favor inicia sesión nuevamente.',
        icon: 'error',
      };

    default:
      return {
        title: '🔒 Sesión terminada',
        message: 'Tu sesión ha finalizado. Por favor inicia sesión nuevamente.',
        icon: 'info',
      };
  }
}
