import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class CongregacionService {
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

  // Obtener todas las congregaciones
  getCongregaciones(): Observable<CongregacionModel[]> {
    return this.httpClient
      .get<{ ok: boolean; congregacion: CongregacionModel[] }>(`${base_url}/congregacion`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.congregacion;
          } else {
            throw new Error('No se pudieron obtener las congregaciones');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener una congregación específica
  getCongregacion(id: number): Observable<CongregacionModel> {
    return this.httpClient
      .get<{ ok: boolean; congregacion: CongregacionModel }>(`${base_url}/congregacion/${id}`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.congregacion;
          } else {
            throw new Error('No se pudo obtener la congregación');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Crear una nueva congregación
  crearCongregacion(congregacion: CongregacionModel): Observable<CongregacionModel> {
    return this.httpClient
      .post<CongregacionModel>(`${base_url}/congregacion`, congregacion, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar una congregación existente
  actualizarCongregacion(congregacion: CongregacionModel): Observable<CongregacionModel> {
    return this.httpClient
      .put<CongregacionModel>(`${base_url}/congregacion/${congregacion.id}`, congregacion, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Eliminar una congregación
  eliminarCongregacion(congregacion: CongregacionModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/congregacion/${congregacion.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Activar una congregación
  activarCongregacion(congregacion: CongregacionModel): Observable<CongregacionModel> {
    return this.httpClient
      .put<CongregacionModel>(`${base_url}/congregacion/activar/${congregacion.id}`, congregacion, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
