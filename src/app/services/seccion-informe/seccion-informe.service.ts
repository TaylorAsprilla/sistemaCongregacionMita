import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SeccionInformeModel } from 'src/app/core/models/seccion-informe.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SeccionInformeService {
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

  getSeccionesInformes(): Observable<SeccionInformeModel[]> {
    return this.httpClient
      .get<{ ok: boolean; seccionesInforme: SeccionInformeModel[] }>(`${base_url}/seccioninforme`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.seccionesInforme : [])), // Manejo de la respuesta
        catchError(this.handleError<SeccionInformeModel[]>('getSeccionesInformes', [])) // Manejo de errores
      );
  }

  getSeccionInforme(id: string): Observable<SeccionInformeModel | null> {
    return this.httpClient
      .get<{ ok: boolean; seccionInforme: SeccionInformeModel }>(`${base_url}/seccioninforme/${id}`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.seccionInforme : null)), // Manejo de la respuesta
        catchError(this.handleError<SeccionInformeModel | null>('getSeccionInforme', null)) // Manejo de errores
      );
  }

  crearSeccionInforme(seccionInforme: SeccionInformeModel): Observable<SeccionInformeModel> {
    return this.httpClient
      .post<SeccionInformeModel>(`${base_url}/seccioninforme`, seccionInforme, this.headers)
      .pipe(catchError(this.handleError<SeccionInformeModel>('crearSeccionInforme')));
  }

  actualizarSeccionInforme(seccionInforme: SeccionInformeModel): Observable<SeccionInformeModel> {
    return this.httpClient
      .put<SeccionInformeModel>(`${base_url}/seccioninforme/${seccionInforme.id}`, seccionInforme, this.headers)
      .pipe(catchError(this.handleError<SeccionInformeModel>('actualizarSeccionInforme')));
  }

  eliminarSeccionInforme(seccionInforme: SeccionInformeModel): Observable<any> {
    return this.httpClient
      .delete(`${base_url}/seccioninforme/${seccionInforme.id}`, this.headers)
      .pipe(catchError(this.handleError<any>('eliminarSeccionInforme')));
  }

  private handleError<T>(operation = 'operación', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error); // Log del error
      return of(result as T); // Retorna un valor por defecto en caso de error
    };
  }
}
