import { HttpErrorResponse } from '@angular/common/http';

/**
 * Sanitiza mensajes de error HTTP eliminando URLs sensibles de la API
 * @param error Error HTTP o cualquier error
 * @returns Mensaje sanitizado sin URLs
 */
export function sanitizeErrorMessage(error: any): string {
  if (!error) {
    return 'Error desconocido';
  }

  // Si es un HttpErrorResponse
  if (error instanceof HttpErrorResponse) {
    const statusCode = error.status;
    const statusText = error.statusText || 'Error';

    // Extraer solo el endpoint sin la URL completa
    let endpoint = 'API';
    if (error.url) {
      try {
        const url = new URL(error.url);
        endpoint = url.pathname; // Solo la ruta sin dominio
      } catch {
        endpoint = 'API';
      }
    }

    // Construir mensaje sin revelar URL completa
    return `Error ${statusCode}: ${statusText} en ${endpoint}`;
  }

  // Si es un error con mensaje
  if (error.message) {
    // Eliminar URLs del mensaje usando regex
    return error.message.replace(/https?:\/\/[^\s]+/gi, '[API]');
  }

  // Fallback
  return String(error).replace(/https?:\/\/[^\s]+/gi, '[API]');
}

/**
 * Versión simplificada que solo retorna el código de estado
 * @param error Error HTTP
 * @returns Mensaje simple con solo status code
 */
export function getErrorStatusMessage(error: HttpErrorResponse): string {
  return `Error HTTP ${error.status}: ${error.statusText || 'Error en la petición'}`;
}

/**
 * Console.error seguro que sanitiza el error antes de mostrarlo
 * @param prefix Prefijo del mensaje
 * @param error Error a mostrar
 */
export function safeConsoleError(prefix: string, error: any): void {
  const sanitized = sanitizeErrorMessage(error);
  console.error(`${prefix}:`, sanitized);

  // En desarrollo, mostrar detalles adicionales sin la URL
  if (error instanceof HttpErrorResponse && error.error) {
    console.error('Detalles del error:', error.error);
  }
}
