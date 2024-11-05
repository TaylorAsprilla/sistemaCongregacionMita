import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ContabilidadModel } from 'src/app/core/models/contabilidad.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ContabilidadService {
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

  // Obtener todas las contabilidades
  getContabilidad(): Observable<ContabilidadModel[]> {
    return this.httpClient
      .get<{ ok: boolean; contabilidad: ContabilidadModel[] }>(`${base_url}/contabilidad/`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.contabilidad;
          } else {
            throw new Error('No se pudieron obtener las contabilidades');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener una contabilidad específica
  getUnaContabilidad(id: number): Observable<ContabilidadModel> {
    return this.httpClient
      .get<{ ok: boolean; contabilidad: ContabilidadModel }>(`${base_url}/contabilidad/${id}`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.contabilidad;
          } else {
            throw new Error('No se pudo obtener la contabilidad');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Crear una nueva contabilidad
  crearContabilidad(contabilidad: ContabilidadModel): Observable<ContabilidadModel> {
    return this.httpClient
      .post<ContabilidadModel>(`${base_url}/contabilidad`, contabilidad, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar una contabilidad existente
  actualizarContabilidad(contabilidad: ContabilidadModel): Observable<ContabilidadModel> {
    return this.httpClient
      .put<ContabilidadModel>(`${base_url}/contabilidad/${contabilidad.id}`, contabilidad, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
