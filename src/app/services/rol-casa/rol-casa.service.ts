import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class RolCasaService {
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

  getRolCasa(): Observable<RolCasaModel[]> {
    return this.httpClient.get<{ ok: boolean; rolCasa: RolCasaModel[] }>(`${base_url}/rolcasa`, this.headers).pipe(
      map((response) => (response.ok ? response.rolCasa : [])), // Manejo de la respuesta
      catchError(this.handleError<RolCasaModel[]>('getRolCasa', [])) // Manejo de errores
    );
  }

  getUnRolCasa(id: number): Observable<RolCasaModel | null> {
    return this.httpClient.get<{ ok: boolean; rolcasa: RolCasaModel }>(`${base_url}/rolcasa/${id}`, this.headers).pipe(
      map((response) => (response.ok ? response.rolcasa : null)), // Manejo de la respuesta
      catchError(this.handleError<RolCasaModel | null>('getUnRolCasa', null)) // Manejo de errores
    );
  }

  crearRolCasa(rolCasa: string): Observable<RolCasaModel> {
    return this.httpClient
      .post<RolCasaModel>(`${base_url}/rolcasa`, { rolCasa }, this.headers)
      .pipe(catchError(this.handleError<RolCasaModel>('crearRolCasa')));
  }

  actualizarRolCasa(rolCasa: RolCasaModel): Observable<RolCasaModel> {
    return this.httpClient
      .put<RolCasaModel>(`${base_url}/rolcasa/${rolCasa.id}`, rolCasa, this.headers)
      .pipe(catchError(this.handleError<RolCasaModel>('actualizarRolCasa')));
  }

  eliminarRolCasa(rolCasa: RolCasaModel): Observable<any> {
    return this.httpClient
      .delete(`${base_url}/rolcasa/${rolCasa.id}`, this.headers)
      .pipe(catchError(this.handleError<any>('eliminarRolCasa')));
  }

  activarRolCasa(rolCasa: RolCasaModel): Observable<RolCasaModel> {
    return this.httpClient
      .put<RolCasaModel>(`${base_url}/rolcasa/activar/${rolCasa.id}`, rolCasa, this.headers)
      .pipe(catchError(this.handleError<RolCasaModel>('activarRolCasa')));
  }

  private handleError<T>(operation = 'operación', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error); // Log del error
      return of(result as T); // Retorna un valor por defecto en caso de error
    };
  }
}
