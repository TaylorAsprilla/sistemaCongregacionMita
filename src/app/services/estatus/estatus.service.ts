import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { EstatusModel } from 'src/app/core/models/estatus.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class EstatusService {
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

  getEstatus(): Observable<EstatusModel[]> {
    return this.httpClient
      .get<{ ok: boolean; tipoStatus: EstatusModel[] }>(`${base_url}/tipostatus/`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.tipoStatus;
          } else {
            throw new Error('No se pudieron obtener los estatus');
          }
        }),
        catchError(this.handleError)
      );
  }

  crearEstatus(estatus: EstatusModel): Observable<EstatusModel> {
    return this.httpClient
      .post<EstatusModel>(`${base_url}/tipostatus`, estatus, this.headers)
      .pipe(catchError(this.handleError));
  }

  actualizarEstatus(estatus: EstatusModel): Observable<EstatusModel> {
    return this.httpClient
      .put<EstatusModel>(`${base_url}/tipostatus/${estatus.id}`, estatus, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
