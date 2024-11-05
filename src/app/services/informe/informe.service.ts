import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { InformeModel } from 'src/app/core/models/informe.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class InformeService {
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

  // Obtener todos los informes
  getInformes(): Observable<InformeModel[]> {
    return this.httpClient.get<{ ok: boolean; informes: InformeModel[] }>(`${base_url}/informe`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.informes;
        } else {
          throw new Error('No se pudieron obtener los informes');
        }
      }),
      catchError(this.handleError)
    );
  }

  getInforme(id: number): Observable<InformeModel> {
    return this.httpClient.get<{ ok: boolean; informe: InformeModel }>(`${base_url}/informe/${id}`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.informe;
        } else {
          throw new Error('No se pudo obtener el informe');
        }
      }),
      catchError(this.handleError)
    );
  }

  crearInforme(informe: InformeModel): Observable<InformeModel> {
    return this.httpClient
      .post<InformeModel>(`${base_url}/informe`, informe, this.headers)
      .pipe(catchError(this.handleError));
  }

  actualizarInforme(informe: InformeModel): Observable<InformeModel> {
    return this.httpClient
      .put<InformeModel>(`${base_url}/informe/${informe.id}`, informe, this.headers)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
