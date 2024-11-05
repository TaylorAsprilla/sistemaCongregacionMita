import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LinkEventoModel } from 'src/app/core/models/link-evento.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class LinkEventosService {
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

  getEventos(): Observable<LinkEventoModel[]> {
    return this.httpClient.get<{ ok: boolean; linkEvento: LinkEventoModel[] }>(`${base_url}/evento`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.linkEvento;
        } else {
          throw new Error('No se pudieron obtener los eventos');
        }
      }),
      catchError(this.handleError)
    );
  }

  getUnLinkEvento(id: number): Observable<LinkEventoModel> {
    return this.httpClient
      .get<{ ok: boolean; linkEvento: LinkEventoModel }>(`${base_url}/evento/${id}`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.linkEvento;
          } else {
            throw new Error('No se pudo obtener el evento');
          }
        }),
        catchError(this.handleError)
      );
  }

  getLinkServicio(): Observable<LinkEventoModel> {
    return this.httpClient
      .get<{ ok: boolean; linkEvento: LinkEventoModel }>(`${base_url}/evento/link/servicio`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.linkEvento;
          } else {
            throw new Error('No se pudo obtener el link del servicio');
          }
        }),
        catchError(this.handleError)
      );
  }

  crearEvento(evento: LinkEventoModel): Observable<LinkEventoModel> {
    return this.httpClient
      .post<LinkEventoModel>(`${base_url}/evento`, evento, this.headers)
      .pipe(catchError(this.handleError));
  }

  actualizarEvento(evento: LinkEventoModel): Observable<LinkEventoModel> {
    return this.httpClient
      .put<LinkEventoModel>(`${base_url}/evento/${evento.id}`, evento, this.headers)
      .pipe(catchError(this.handleError));
  }

  eliminarEvento(evento: LinkEventoModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/evento/${evento.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  activarEvento(evento: LinkEventoModel): Observable<LinkEventoModel> {
    return this.httpClient
      .put<LinkEventoModel>(`${base_url}/evento/activar/${evento.id}`, evento, this.headers)
      .pipe(catchError(this.handleError));
  }

  agregarABiblioteca(evento: LinkEventoModel): Observable<LinkEventoModel> {
    return this.httpClient
      .put<LinkEventoModel>(`${base_url}/evento/agregarbiblioteca/${evento.id}`, evento, this.headers)
      .pipe(catchError(this.handleError));
  }

  eliminarDeLaBiblioteca(evento: LinkEventoModel): Observable<LinkEventoModel> {
    return this.httpClient
      .put<LinkEventoModel>(`${base_url}/evento/eliminardebiblioteca/${evento.id}`, evento, this.headers)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
