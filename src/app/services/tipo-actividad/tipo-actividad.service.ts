import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoActividadService {
  constructor(private httpClient: HttpClient) {}

  // Obtiene el token de localStorage
  private get token(): string {
    return localStorage.getItem('token') || '';
  }

  // Configuración de las cabeceras
  private get headers() {
    return { headers: { 'x-token': this.token } };
  }

  // Obtener todos los tipos de actividad
  getTipoActividad(): Observable<TipoActividadModel[]> {
    return this.httpClient
      .get<{ ok: boolean; tipoActividad: TipoActividadModel[] }>(`${base_url}/tipoactividad/`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.tipoActividad : [])), // Si 'ok' es false, se devuelve un array vacío
        catchError(this.handleError<TipoActividadModel[]>('getTipoActividad', [])) // Manejo de errores
      );
  }

  // Crear un nuevo tipo de actividad
  crearTipoActividad(tipoActividad: TipoActividadModel): Observable<any> {
    return this.httpClient
      .post(`${base_url}/tipoactividad`, tipoActividad, this.headers)
      .pipe(catchError(this.handleError('crearTipoActividad'))); // Manejo de errores
  }

  // Eliminar un tipo de actividad
  eliminarTipoActividad(tipoActividad: TipoActividadModel): Observable<any> {
    return this.httpClient
      .delete(`${base_url}/tipoactividad/${tipoActividad.id}`, this.headers)
      .pipe(catchError(this.handleError('eliminarTipoActividad'))); // Manejo de errores
  }

  // Manejo genérico de errores
  private handleError<T>(operation = 'operación', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error); // Log de error
      return of(result as T); // Retorna un valor por defecto si ocurre un error
    };
  }
}
