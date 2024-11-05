import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CampoModel } from 'src/app/core/models/campo.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class CampoService {
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

  // Obtener todos los campos
  getCampos(): Observable<CampoModel[]> {
    return this.httpClient.get<{ ok: boolean; campo: CampoModel[] }>(`${base_url}/campo`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.campo;
        } else {
          throw new Error('No se pudieron obtener los campos');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Obtener un campo específico
  getCampo(id: number): Observable<CampoModel> {
    return this.httpClient.get<{ ok: boolean; campo: CampoModel }>(`${base_url}/campo/${id}`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.campo;
        } else {
          throw new Error('No se pudo obtener el campo');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Crear un nuevo campo
  crearCampo(campo: CampoModel): Observable<CampoModel> {
    return this.httpClient
      .post<CampoModel>(`${base_url}/campo`, campo, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un campo existente
  actualizarCampo(campo: CampoModel): Observable<CampoModel> {
    return this.httpClient
      .put<CampoModel>(`${base_url}/campo/${campo.id}`, campo, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un campo
  eliminarCampo(campo: CampoModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/campo/${campo.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Activar un campo
  activarCampo(campo: CampoModel): Observable<CampoModel> {
    return this.httpClient
      .put<CampoModel>(`${base_url}/campo/activar/${campo.id}`, campo, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
