import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  SolicitudMultimediaInterface,
  SolicitudMultimediaModel,
  crearSolicitudMultimediaInterface,
} from 'src/app/core/models/solicitud-multimedia.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SolicitudMultimediaService {
  public solicitudMultimedia: SolicitudMultimediaModel[] = [];

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

  getSolicitudes(): Observable<SolicitudMultimediaInterface[]> {
    return this.httpClient
      .get<{ ok: boolean; solicitudDeAccesos: SolicitudMultimediaInterface[] }>(
        `${base_url}/solicitudmultimedia`,
        this.headers
      )
      .pipe(
        map((respuesta) => (respuesta.ok ? respuesta.solicitudDeAccesos : [])),
        catchError(this.handleError<SolicitudMultimediaInterface[]>('getSolicitudes', []))
      );
  }

  getSolicitud(id: number): Observable<SolicitudMultimediaInterface | null> {
    return this.httpClient
      .get<{ ok: boolean; solicitudDeAcceso: SolicitudMultimediaInterface }>(
        `${base_url}/solicitudmultimedia/${id}`,
        this.headers
      )
      .pipe(
        map((respuesta) => (respuesta.ok ? respuesta.solicitudDeAcceso : null)),
        catchError(this.handleError<SolicitudMultimediaInterface | null>('getSolicitud', null)) // Permitir que el valor predeterminado sea null
      );
  }

  crearSolicitudMultimedia(solicitudDeacceso: crearSolicitudMultimediaInterface): Observable<any> {
    return this.httpClient
      .post(`${base_url}/solicitudmultimedia`, solicitudDeacceso, this.headers)
      .pipe(catchError(this.handleError('crearSolicitudMultimedia')));
  }

  validarEmail(id: number): Observable<any> {
    return this.httpClient
      .put(`${base_url}/solicitudmultimedia/validaremail/${id}`, null, this.headers)
      .pipe(catchError(this.handleError('validarEmail')));
  }

  eliminarSolicitudMultimedia(idsolicitudDeacceso: number): Observable<any> {
    return this.httpClient
      .delete(`${base_url}/solicitudmultimedia/${idsolicitudDeacceso}`, this.headers)
      .pipe(catchError(this.handleError('eliminarSolicitudMultimedia')));
  }

  actualizarSolicitudMultimedia(solicitudDeacceso: SolicitudMultimediaInterface, id: number): Observable<any> {
    return this.httpClient
      .put(`${base_url}/solicitudmultimedia/${id}`, solicitudDeacceso, this.headers)
      .pipe(catchError(this.handleError('actualizarSolicitudMultimedia')));
  }

  activarSolicitudMultimedia(solicitudDeacceso: SolicitudMultimediaModel): Observable<any> {
    return this.httpClient
      .put(`${base_url}/solicitudmultimedia/activar/${solicitudDeacceso.id}`, solicitudDeacceso, this.headers)
      .pipe(catchError(this.handleError('activarSolicitudMultimedia')));
  }

  private handleError<T>(operation = 'operación', result?: T | null) {
    // Cambiar la firma para aceptar null
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error); // Log de error
      return of(result as T); // Retorna un valor por defecto si ocurre un error
    };
  }
}
