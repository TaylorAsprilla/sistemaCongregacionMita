import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MetaModel } from 'src/app/core/models/meta.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MetaService {
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

  // Obtener todas las metas
  getMetas(): Observable<MetaModel[]> {
    return this.httpClient.get<{ ok: boolean; metas: MetaModel[] }>(`${base_url}/meta`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.metas;
        } else {
          throw new Error('No se pudieron obtener las metas');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Obtener una meta específica por ID
  getMeta(id: number): Observable<MetaModel> {
    return this.httpClient.get<{ ok: boolean; meta: MetaModel }>(`${base_url}/meta/${id}`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.meta;
        } else {
          throw new Error('No se pudo obtener la meta');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Crear una nueva meta
  crearMeta(meta: MetaModel): Observable<MetaModel> {
    return this.httpClient.post<MetaModel>(`${base_url}/meta`, meta, this.headers).pipe(catchError(this.handleError));
  }

  // Actualizar una meta existente
  actualizarMeta(meta: MetaModel): Observable<MetaModel> {
    return this.httpClient
      .put<MetaModel>(`${base_url}/meta/${meta.id}`, meta, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
