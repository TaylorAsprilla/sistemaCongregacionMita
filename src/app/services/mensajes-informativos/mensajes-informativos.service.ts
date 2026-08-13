import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  MensajeInformativo,
  MensajeInformativoResponse,
  MensajesActivosResponse,
  MensajesInformativosResponse,
} from 'src/app/core/interfaces/mensaje-informativo.interface';

@Injectable({
  providedIn: 'root',
})
export class MensajesInformativosService {
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
   * Listado completo de mensajes informativos (vista administrativa)
   * GET /api/mensajes-informativos
   */
  obtenerTodos(): Observable<MensajesInformativosResponse> {
    const url = `${this.baseUrl}/mensajes-informativos`;
    return this.http.get<MensajesInformativosResponse>(url, this.headers);
  }

  /**
   * Mensajes vigentes para mostrar en el Home
   * GET /api/mensajes-informativos/activos
   */
  obtenerActivos(): Observable<MensajesActivosResponse> {
    const url = `${this.baseUrl}/mensajes-informativos/activos`;
    return this.http.get<MensajesActivosResponse>(url, this.headers);
  }

  /**
   * Obtener un mensaje informativo por ID
   * GET /api/mensajes-informativos/:id
   */
  obtenerPorId(id: number): Observable<MensajeInformativoResponse> {
    const url = `${this.baseUrl}/mensajes-informativos/${id}`;
    return this.http.get<MensajeInformativoResponse>(url, this.headers);
  }

  /**
   * Crear un nuevo mensaje informativo
   * POST /api/mensajes-informativos
   */
  crear(payload: MensajeInformativo): Observable<MensajeInformativoResponse> {
    const url = `${this.baseUrl}/mensajes-informativos`;
    return this.http.post<MensajeInformativoResponse>(url, payload, this.headers);
  }

  /**
   * Actualizar un mensaje informativo
   * PATCH /api/mensajes-informativos/:id
   */
  actualizar(id: number, payload: Partial<MensajeInformativo>): Observable<MensajeInformativoResponse> {
    const url = `${this.baseUrl}/mensajes-informativos/${id}`;
    return this.http.patch<MensajeInformativoResponse>(url, payload, this.headers);
  }

  /**
   * Eliminar un mensaje informativo
   * DELETE /api/mensajes-informativos/:id
   */
  eliminar(id: number): Observable<{ ok: boolean; msg?: string }> {
    const url = `${this.baseUrl}/mensajes-informativos/${id}`;
    return this.http.delete<{ ok: boolean; msg?: string }>(url, this.headers);
  }

  /**
   * Cambiar el estado activo/inactivo de un mensaje informativo
   */
  cambiarEstado(id: number, activo: boolean): Observable<MensajeInformativoResponse> {
    return this.actualizar(id, { activo });
  }
}
