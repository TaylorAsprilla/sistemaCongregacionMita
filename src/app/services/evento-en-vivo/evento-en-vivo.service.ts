import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  EventoEnVivo,
  EventoEnVivoResponse,
  EventosEnVivoResponse,
  UltimoEventoResponse,
} from 'src/app/core/interfaces/evento-en-vivo.interface';

@Injectable({
  providedIn: 'root',
})
export class EventoEnVivoService {
  private http = inject(HttpClient);
  private baseUrl = environment.base_url;

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
   * Crear un nuevo evento en vivo
   * POST /api/evento-en-vivo
   */
  crearEvento(evento: EventoEnVivo): Observable<EventoEnVivoResponse> {
    const url = `${this.baseUrl}/evento-en-vivo`;
    return this.http.post<EventoEnVivoResponse>(url, evento, this.headers);
  }

  /**
   * Obtener el último evento en vivo activo
   * GET /api/evento-en-vivo/ultimo
   */
  obtenerUltimoEvento(): Observable<UltimoEventoResponse> {
    const url = `${this.baseUrl}/evento-en-vivo/ultimo`;
    return this.http.get<UltimoEventoResponse>(url, this.headers);
  }

  /**
   * Obtener todos los eventos en vivo
   * GET /api/evento-en-vivo
   */
  obtenerEventos(): Observable<EventosEnVivoResponse> {
    const url = `${this.baseUrl}/evento-en-vivo`;
    return this.http.get<EventosEnVivoResponse>(url, this.headers);
  }

  /**
   * Obtener un evento en vivo por ID
   * GET /api/evento-en-vivo/:id
   */
  obtenerEventoPorId(id: number): Observable<EventoEnVivoResponse> {
    const url = `${this.baseUrl}/evento-en-vivo/${id}`;
    return this.http.get<EventoEnVivoResponse>(url, this.headers);
  }

  /**
   * Actualizar un evento en vivo
   * PUT /api/evento-en-vivo/:id
   */
  actualizarEvento(id: number, evento: Partial<EventoEnVivo>): Observable<EventoEnVivoResponse> {
    const url = `${this.baseUrl}/evento-en-vivo/${id}`;
    return this.http.put<EventoEnVivoResponse>(url, evento, this.headers);
  }

  /**
   * Eliminar un evento en vivo
   * DELETE /api/evento-en-vivo/:id
   */
  eliminarEvento(id: number): Observable<EventoEnVivoResponse> {
    const url = `${this.baseUrl}/evento-en-vivo/${id}`;
    return this.http.delete<EventoEnVivoResponse>(url, this.headers);
  }

  /**
   * Cambiar estado de un evento (activar/desactivar)
   * PUT /api/evento-en-vivo/:id
   */
  cambiarEstadoEvento(id: number, estado: boolean): Observable<EventoEnVivoResponse> {
    return this.actualizarEvento(id, { estado });
  }
}
