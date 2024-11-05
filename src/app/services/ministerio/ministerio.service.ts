import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MinisterioService {
  constructor(private httpClient: HttpClient) {}

  private get token(): string {
    return localStorage.getItem('token') || '';
  }

  private get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  // Obtener todos los ministerios
  getMinisterios(): Observable<MinisterioModel[]> {
    return this.httpClient
      .get<{ ok: boolean; ministerio: MinisterioModel[] }>(`${base_url}/ministerio`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.ministerio;
          } else {
            throw new Error('No se pudieron obtener los ministerios');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener un ministerio específico por ID
  getMinisterio(id: number): Observable<MinisterioModel> {
    return this.httpClient
      .get<{ ok: boolean; ministerio: MinisterioModel }>(`${base_url}/ministerio/${id}`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.ministerio;
          } else {
            throw new Error('No se pudo obtener el ministerio');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Crear un nuevo ministerio
  crearMinisterio(ministerio: MinisterioModel): Observable<MinisterioModel> {
    return this.httpClient
      .post<MinisterioModel>(`${base_url}/ministerio`, ministerio, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un ministerio existente
  actualizarMinisterio(ministerio: MinisterioModel): Observable<MinisterioModel> {
    return this.httpClient
      .put<MinisterioModel>(`${base_url}/ministerio/${ministerio.id}`, ministerio, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un ministerio
  eliminarMinisterio(ministerio: MinisterioModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/ministerio/${ministerio.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Activar un ministerio
  activarMinisterio(ministerio: MinisterioModel): Observable<MinisterioModel> {
    return this.httpClient
      .put<MinisterioModel>(`${base_url}/ministerio/activar/${ministerio.id}`, ministerio, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
