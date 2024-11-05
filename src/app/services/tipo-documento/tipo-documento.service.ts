import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  // Obtiene el token de localStorage
  private get token(): string {
    return localStorage.getItem('token') || '';
  }

  // Configuración de las cabeceras
  private get headers() {
    return { headers: { 'x-token': this.token } };
  }

  // Obtener todos los tipos de documentos
  getTiposDeDocumentos(): Observable<TipoDocumentoModel[]> {
    return this.httpClient
      .get<{ ok: boolean; tipoDocumento: TipoDocumentoModel[] }>(`${base_url}/tipodocumento`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.tipoDocumento : [])), // Retorna un array vacío si no es ok
        catchError(this.handleError<TipoDocumentoModel[]>('getTiposDeDocumentos', [])) // Manejo de errores
      );
  }

  // Obtener un tipo de documento por su ID
  getTipoDocumento(id: string): Observable<TipoDocumentoModel | null> {
    return this.httpClient
      .get<{ ok: boolean; tipoDocumento: TipoDocumentoModel }>(`${base_url}/tipodocumento/${id}`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.tipoDocumento : null)),
        catchError(this.handleError<TipoDocumentoModel | null>('getTipoDocumento', null)) // Manejo de errores
      );
  }

  // Crear un nuevo tipo de documento
  crearTipoDocumento(tipoDocumento: TipoDocumentoModel): Observable<any> {
    return this.httpClient
      .post(`${base_url}/tipodocumento`, tipoDocumento, this.headers)
      .pipe(catchError(this.handleError('crearTipoDocumento'))); // Manejo de errores
  }

  // Actualizar un tipo de documento existente
  actualizarTipoDocumento(tipoDocumento: TipoDocumentoModel): Observable<any> {
    return this.httpClient
      .put(`${base_url}/tipodocumento/${tipoDocumento.id}`, tipoDocumento, this.headers)
      .pipe(catchError(this.handleError('actualizarTipoDocumento'))); // Manejo de errores
  }

  // Eliminar un tipo de documento
  eliminarTipoDocumento(tipoDocumento: TipoDocumentoModel): Observable<any> {
    return this.httpClient
      .delete(`${base_url}/tipodocumento/${tipoDocumento.id}`, this.headers)
      .pipe(catchError(this.handleError('eliminarTipoDocumento'))); // Manejo de errores
  }

  // Activar un tipo de documento
  activarTipoDocumento(tipoDocumento: TipoDocumentoModel): Observable<any> {
    return this.httpClient
      .put(`${base_url}/tipodocumento/activar/${tipoDocumento.id}`, tipoDocumento, this.headers)
      .pipe(catchError(this.handleError('activarTipoDocumento'))); // Manejo de errores
  }

  // Método genérico para manejar errores
  private handleError<T>(operation = 'operación', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error); // Log de error
      return of(result as T); // Retorna el valor por defecto si hay un error
    };
  }
}
