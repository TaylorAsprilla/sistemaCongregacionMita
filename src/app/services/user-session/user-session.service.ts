import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environment';
import {
  UserSessionInterface,
  UserSessionsResponseInterface,
  UserSessionDisplayInterface,
} from 'src/app/core/interfaces/user-session.interface';

const base_url = environment.base_url;

/**
 * Servicio para gestionar el historial de sesiones del usuario.
 *
 * Permite consultar las sesiones activas e históricas, incluyendo
 * información de ubicación, dispositivo y fecha de acceso.
 *
 * @example
 * // En un componente:
 * this.userSessionService.getSesionesUsuario().subscribe(sesiones => {
 *   this.sesiones = sesiones;
 * });
 */
@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private httpClient = inject(HttpClient);

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
   * Obtiene todas las sesiones del usuario actual (activas e inactivas)
   *
   * @returns Observable con array de sesiones
   */
  getSesionesUsuario(): Observable<UserSessionInterface[]> {
    return this.httpClient
      .get<UserSessionsResponseInterface>(`${base_url}/login/sesiones`, this.headers)
      .pipe(map((response) => response.sesiones || []));
  }

  /**
   * Obtiene solo las sesiones activas del usuario
   *
   * @returns Observable con array de sesiones activas
   */
  getSesionesActivas(): Observable<UserSessionInterface[]> {
    return this.httpClient
      .get<UserSessionsResponseInterface>(`${base_url}/login/sesiones/activas`, this.headers)
      .pipe(map((response) => response.sesiones || []));
  }

  /**
   * Cierra una sesión específica (útil para cerrar sesión en otro dispositivo)
   *
   * @param sessionId - ID de la sesión a cerrar
   * @returns Observable con respuesta del servidor
   */
  cerrarSesion(sessionId: number): Observable<any> {
    return this.httpClient.delete(`${base_url}/login/sesiones/${sessionId}`, this.headers);
  }

  /**
   * Cierra todas las sesiones excepto la actual
   *
   * @returns Observable con respuesta del servidor
   */
  cerrarTodasLasSesiones(): Observable<any> {
    return this.httpClient.delete(`${base_url}/login/sesiones/todas`, this.headers);
  }

  /**
   * Obtiene la información de ubicación de la sesión actual
   *
   * @returns Observable con información de ubicación
   */
  getUbicacionSesionActual(): Observable<any> {
    return this.httpClient.get(`${base_url}/login/sesion/ubicacion`, this.headers);
  }

  /**
   * Transforma sesiones del backend a formato para mostrar en UI
   *
   * @param sesiones - Array de sesiones del backend
   * @param tokenActual - Token de la sesión actual para marcarla
   * @returns Array de sesiones formateadas para UI
   */
  transformarParaUI(sesiones: UserSessionInterface[], tokenActual: string): UserSessionDisplayInterface[] {
    return sesiones.map((sesion) => ({
      id: sesion.id,
      dispositivo: this.formatearDispositivo(sesion.dispositivo, sesion.userAgent),
      ubicacion: this.formatearUbicacion(sesion.ciudad, sesion.pais),
      ip: sesion.ip,
      fechaInicio: sesion.fechaInicio,
      fechaUltimaActividad: sesion.fechaUltimaActividad,
      esActual: sesion.token === tokenActual,
      activa: sesion.activa,
    }));
  }

  /**
   * Formatea el nombre del dispositivo para mostrar en UI
   *
   * @param dispositivo - Nombre del dispositivo
   * @param userAgent - User agent completo
   * @returns String formateado con dispositivo y navegador
   */
  private formatearDispositivo(dispositivo: string, userAgent: string): string {
    // Extraer navegador del user agent
    let navegador = 'Navegador desconocido';

    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      navegador = 'Chrome';
    } else if (userAgent.includes('Edg')) {
      navegador = 'Edge';
    } else if (userAgent.includes('Firefox')) {
      navegador = 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      navegador = 'Safari';
    }

    return `${dispositivo} (${navegador})`;
  }

  /**
   * Formatea la ubicación para mostrar en UI
   *
   * @param ciudad - Ciudad
   * @param pais - País
   * @returns String formateado "Ciudad, País" o "Ubicación desconocida"
   */
  private formatearUbicacion(ciudad: string | null, pais: string | null): string {
    if (ciudad && pais) {
      return `${ciudad}, ${pais}`;
    } else if (pais) {
      return pais;
    } else if (ciudad) {
      return ciudad;
    }
    return 'Ubicación desconocida';
  }

  /**
   * Obtiene el icono apropiado según el tipo de dispositivo
   *
   * @param dispositivo - Nombre del dispositivo
   * @returns String con clase CSS del icono (Font Awesome)
   */
  getIconoDispositivo(dispositivo: string): string {
    const dispositivoLower = dispositivo.toLowerCase();

    if (dispositivoLower.includes('mobile') || dispositivoLower.includes('phone')) {
      return 'fas fa-mobile-alt';
    } else if (dispositivoLower.includes('tablet') || dispositivoLower.includes('ipad')) {
      return 'fas fa-tablet-alt';
    } else {
      return 'fas fa-desktop';
    }
  }
}
