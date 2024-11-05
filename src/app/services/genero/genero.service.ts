import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { GeneroModel } from 'src/app/core/models/genero.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class GeneroService {
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

  getGeneros(): Observable<GeneroModel[]> {
    return this.httpClient.get<{ ok: boolean; genero: GeneroModel[] }>(`${base_url}/genero`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.genero;
        } else {
          throw new Error('No se pudieron obtener los géneros');
        }
      }),
      catchError(this.handleError)
    );
  }

  getGenero(id: number): Observable<GeneroModel> {
    return this.httpClient.get<{ ok: boolean; genero: GeneroModel }>(`${base_url}/genero/${id}`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.genero;
        } else {
          throw new Error('No se pudo obtener el género');
        }
      }),
      catchError(this.handleError)
    );
  }

  crearGenero(genero: string): Observable<GeneroModel> {
    return this.httpClient
      .post<GeneroModel>(`${base_url}/genero`, { genero }, this.headers)
      .pipe(catchError(this.handleError));
  }

  actualizarGenero(genero: GeneroModel): Observable<GeneroModel> {
    return this.httpClient
      .put<GeneroModel>(`${base_url}/genero/${genero.id}`, genero, this.headers)
      .pipe(catchError(this.handleError));
  }

  eliminarGenero(genero: GeneroModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/genero/${genero.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  activarGenero(genero: GeneroModel): Observable<GeneroModel> {
    return this.httpClient
      .put<GeneroModel>(`${base_url}/genero/activar/${genero.id}`, genero, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
