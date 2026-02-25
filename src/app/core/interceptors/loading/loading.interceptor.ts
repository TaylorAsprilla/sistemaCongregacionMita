import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { LoadingService } from '../../services/loading/loading.service';
import { getLoadingMessage } from '../../constants/loading-messages.constant';

/**
 * Token de contexto HTTP para deshabilitar el loading en requests específicos
 *
 * @example
 * const context = new HttpContext().set(SKIP_LOADING, true);
 * this.http.get('/api/endpoint', { context });
 */
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

/**
 * Token de contexto HTTP para sobrescribir el mensaje de loading
 *
 * @example
 * const context = new HttpContext().set(LOADING_MESSAGE, 'Procesando archivo grande...');
 * this.http.post('/api/upload', data, { context });
 */
export const LOADING_MESSAGE = new HttpContextToken<string>(() => '');

/**
 * Interceptor funcional de Loading para Angular 17+
 *
 * Captura TODOS los requests HTTP y:
 * 1. Genera un ID único para cada request
 * 2. Determina el mensaje apropiado (via HttpContext, headers, o mapeo de URL)
 * 3. Activa el loading global via LoadingService
 * 4. Al finalizar (éxito o error), desactiva el loading
 *
 * El servicio LoadingService maneja automáticamente:
 * - Contador de requests concurrentes
 * - Debounce para evitar parpadeos
 * - Tiempo mínimo de visualización
 * - Mensajes combinados cuando hay múltiples requests
 *
 * PRIORIDAD DE MENSAJES:
 * 1. HttpContext.set(LOADING_MESSAGE, '...')
 * 2. Header 'X-Loading-Label'
 * 3. Mapeo por URL + método (loading-messages.constant.ts)
 * 4. Fallback: 'Procesando...'
 *
 * CASOS DE USO:
 *
 * @example
 * // Caso 1: Loading automático (por defecto)
 * this.http.get('/api/usuarios').subscribe(...);
 * // Muestra: "Consultando usuarios..." (según mapeo)
 *
 * @example
 * // Caso 2: Deshabilitar loading para un request específico
 * const context = new HttpContext().set(SKIP_LOADING, true);
 * this.http.get('/api/polling', { context }).subscribe(...);
 * // No muestra loading
 *
 * @example
 * // Caso 3: Mensaje personalizado via HttpContext
 * const context = new HttpContext().set(LOADING_MESSAGE, 'Importando 10,000 registros...');
 * this.http.post('/api/import', data, { context }).subscribe(...);
 * // Muestra: "Importando 10,000 registros..."
 *
 * @example
 * // Caso 4: Mensaje personalizado via header
 * const headers = new HttpHeaders().set('X-Loading-Label', 'Procesando archivo PDF...');
 * this.http.post('/api/pdf', data, { headers }).subscribe(...);
 * // Muestra: "Procesando archivo PDF..."
 */
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);

  // PASO 1: Verificar si debemos omitir el loading para este request
  const skipLoading = req.context.get(SKIP_LOADING);
  if (skipLoading) {
    return next(req);
  }

  // PASO 2: Generar ID único para este request
  const requestId = generateRequestId(req);

  // PASO 3: Determinar el mensaje a mostrar (según prioridad)
  const message = determineLoadingMessage(req);

  // PASO 4: Activar loading
  loadingService.show(requestId, message, req.url);

  // PASO 5: Ejecutar request y desactivar loading al finalizar
  return next(req).pipe(
    catchError((error) => {
      // En caso de error, también ocultar el loading
      loadingService.hide(requestId);
      return throwError(() => error);
    }),
    finalize(() => {
      // Siempre ocultar el loading al finalizar (éxito o error)
      loadingService.hide(requestId);
    }),
  );
};

/**
 * Genera un ID único para un request HTTP
 * Formato: timestamp-method-urlHash
 *
 * @param req - Request HTTP
 * @returns ID único
 */
function generateRequestId(req: HttpRequest<unknown>): string {
  const timestamp = Date.now();
  const method = req.method;
  const urlHash = hashCode(req.url);
  const random = Math.random().toString(36).substring(2, 7);
  return `${timestamp}-${method}-${urlHash}-${random}`;
}

/**
 * Genera un hash numérico simple de un string
 *
 * @param str - String a hashear
 * @returns Hash numérico
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Determina el mensaje de loading apropiado para un request
 *
 * Prioridad (de mayor a menor):
 * 1. HttpContext.set(LOADING_MESSAGE, '...')
 * 2. Header 'X-Loading-Label'
 * 3. Mapeo por URL + método (loading-messages.constant.ts)
 * 4. Fallback: 'Procesando...'
 *
 * @param req - Request HTTP
 * @returns Mensaje de loading
 */
function determineLoadingMessage(req: HttpRequest<unknown>): string {
  // Prioridad 1: HttpContext
  const contextMessage = req.context.get(LOADING_MESSAGE);
  if (contextMessage && contextMessage.trim() !== '') {
    return contextMessage;
  }

  // Prioridad 2: Header 'X-Loading-Label'
  const headerMessage = req.headers.get('X-Loading-Label');
  if (headerMessage && headerMessage.trim() !== '') {
    return headerMessage;
  }

  // Prioridad 3: Mapeo por URL + método
  const mappedMessage = getLoadingMessage(req.url, req.method);
  if (mappedMessage && mappedMessage.trim() !== '') {
    return mappedMessage;
  }

  // Fallback
  return 'Procesando...';
}
