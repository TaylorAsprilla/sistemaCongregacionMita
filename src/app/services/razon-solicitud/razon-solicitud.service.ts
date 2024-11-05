import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class RazonSolicitudService {
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

  getRazonsolicitud(): Observable<RazonSolicitudModel[]> {
    return this.httpClient
      .get<{ ok: boolean; razonSolicitud: RazonSolicitudModel[] }>(`${base_url}/razonsolicitud`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.razonSolicitud : [])), // Manejo de la respuesta
        catchError(this.handleError<RazonSolicitudModel[]>('getRazonsolicitud', [])) // Manejo de errores
      );
  }

  getUnaRazonsolicitud(id: number): Observable<RazonSolicitudModel | null> {
    return this.httpClient
      .get<{ ok: boolean; razonSolicitud: RazonSolicitudModel }>(`${base_url}/razonsolicitud/${id}`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.razonSolicitud : null)), // Manejo de la respuesta
        catchError(this.handleError<RazonSolicitudModel | null>('getUnaRazonsolicitud', null)) // Manejo de errores
      );
  }

  crearRazonSolicitud(razonSolicitud: string): Observable<RazonSolicitudModel> {
    return this.httpClient
      .post<RazonSolicitudModel>(
        `${base_url}/razonsolicitud`,
        { solicitud: razonSolicitud, estado: true },
        this.headers
      )
      .pipe(catchError(this.handleError<RazonSolicitudModel>('crearRazonSolicitud')));
  }

  actualizarRazonSolicitud(razonSolicitud: RazonSolicitudModel): Observable<RazonSolicitudModel> {
    return this.httpClient
      .put<RazonSolicitudModel>(`${base_url}/razonsolicitud/${razonSolicitud.id}`, razonSolicitud, this.headers)
      .pipe(catchError(this.handleError<RazonSolicitudModel>('actualizarRazonSolicitud')));
  }

  eliminarRazonsolicitud(razonSolicitud: RazonSolicitudModel): Observable<any> {
    return this.httpClient
      .delete(`${base_url}/razonsolicitud/${razonSolicitud.id}`, this.headers)
      .pipe(catchError(this.handleError<any>('eliminarRazonsolicitud')));
  }

  activarRazonSolicitud(razonSolicitud: RazonSolicitudModel): Observable<RazonSolicitudModel> {
    return this.httpClient
      .put<RazonSolicitudModel>(`${base_url}/razonsolicitud/activar/${razonSolicitud.id}`, razonSolicitud, this.headers)
      .pipe(catchError(this.handleError<RazonSolicitudModel>('activarRazonSolicitud')));
  }

  private handleError<T>(operation = 'operación', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error); // Log del error
      return of(result as T); // Retorna un valor por defecto en caso de error
    };
  }
}
