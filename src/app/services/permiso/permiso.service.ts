import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { PermisoUsuarioModel } from 'src/app/core/models/permiso-usuario.model';
import { PermisoModel } from 'src/app/core/models/permisos.model';
import { ROLES } from 'src/app/routes/menu-items';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
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

  tienePermisos(idUsuario: ROLES, permisos: ROLES[]): boolean {
    // Ahora comprueba si el idUsuario es válido y si hay permisos.
    return permisos.includes(idUsuario);
  }

  getPermisos(): Observable<PermisoModel[]> {
    return this.httpClient.get<{ ok: boolean; permiso: PermisoModel[] }>(`${base_url}/permiso`, this.headers).pipe(
      map((response) => (response.ok ? response.permiso : [])), // Manejo de la respuesta
      catchError(this.handleError<PermisoModel[]>('getPermisos', [])) // Manejo de errores
    );
  }

  getPermisosUsuario(idUsuario: number = 0): Observable<PermisoUsuarioModel[]> {
    return this.httpClient
      .get<{ ok: boolean; permisos: PermisoUsuarioModel[] }>(`${base_url}/permiso/usuario/${idUsuario}`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.permisos : [])), // Manejo de la respuesta
        catchError(this.handleError<PermisoUsuarioModel[]>('getPermisosUsuario', [])) // Manejo de errores
      );
  }

  private handleError<T>(operation = 'operación', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error); // Log del error
      return of(result as T); // Retorna un valor por defecto en caso de error
    };
  }
}
