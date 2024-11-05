import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

import { TipoEstudioModel } from 'src/app/core/models/tipo-estudio.model';
import { Observable, of } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoEstudioService {
  constructor(private httpClient: HttpClient) {}

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

  // Obtener todos los tipos de estudio
  getTipoEstudio(): Observable<TipoEstudioModel[]> {
    return this.httpClient
      .get<{ ok: boolean; tipoEstudio: TipoEstudioModel[] }>(`${base_url}/tipoestudio`, this.headers)
      .pipe(
        map((respuesta) => (respuesta.ok ? respuesta.tipoEstudio : [])), // Retorna array vacío si no es ok
        catchError(this.handleError<TipoEstudioModel[]>('getTipoEstudio', [])) // Manejo de errores
      );
  }

  // Obtener un tipo de estudio por ID
  getUnTipoEstudio(id: number): Observable<TipoEstudioModel | null> {
    return this.httpClient
      .get<{ ok: boolean; tipoEstudio: TipoEstudioModel }>(`${base_url}/tipoestudio/${id}`, this.headers)
      .pipe(
        map((respuesta) => (respuesta.ok ? respuesta.tipoEstudio : null)),
        catchError(this.handleError<TipoEstudioModel | null>('getUnTipoEstudio', null)) // Manejo de errores
      );
  }

  // Crear un nuevo tipo de estudio
  crearTipoEstudio(tipoEstudio: string): Observable<any> {
    return this.httpClient.post(`${base_url}/tipoestudio`, { estudio: tipoEstudio }, this.headers).pipe(
      catchError(this.handleError('crearTipoEstudio')) // Manejo de errores
    );
  }

  // Actualizar un tipo de estudio
  actualizarTipoEstudio(tipoEstudio: TipoEstudioModel): Observable<any> {
    return this.httpClient.put(`${base_url}/tipoestudio/${tipoEstudio.id}`, tipoEstudio, this.headers).pipe(
      catchError(this.handleError('actualizarTipoEstudio')) // Manejo de errores
    );
  }

  // Eliminar un tipo de estudio
  eliminarTipoEstudio(tipoEstudio: TipoEstudioModel): Observable<any> {
    return this.httpClient.delete(`${base_url}/tipoestudio/${tipoEstudio.id}`, this.headers).pipe(
      catchError(this.handleError('eliminarTipoEstudio')) // Manejo de errores
    );
  }

  // Activar un tipo de estudio
  activarTipoEstudio(tipoEstudio: TipoEstudioModel): Observable<any> {
    return this.httpClient.put(`${base_url}/tipoestudio/activar/${tipoEstudio.id}`, tipoEstudio, this.headers).pipe(
      catchError(this.handleError('activarTipoEstudio')) // Manejo de errores
    );
  }

  // Manejo de errores genérico
  private handleError<T>(operation = 'operación', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error);
      return of(result as T); // Devuelve el valor default (null, array vacío, etc.) si hay un error
    };
  }
}
