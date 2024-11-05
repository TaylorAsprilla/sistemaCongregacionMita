import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class NacionalidadService {
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

  // Obtener todas las nacionalidades
  getNacionalidades(): Observable<NacionalidadModel[]> {
    return this.httpClient
      .get<{ ok: boolean; nacionalidades: NacionalidadModel[] }>(`${base_url}/nacionalidad`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.nacionalidades;
          } else {
            throw new Error('No se pudieron obtener las nacionalidades');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener una nacionalidad específica por ID
  getNacionalidad(id: string): Observable<NacionalidadModel> {
    return this.httpClient
      .get<{ ok: boolean; nacionalidad: NacionalidadModel }>(`${base_url}/nacionalidad/${id}`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.nacionalidad;
          } else {
            throw new Error('No se pudo obtener la nacionalidad');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
