import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class TipoMiembroService {
  constructor(private httpClient: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  getTipoMiembro(): Observable<TipoMiembroModel[]> {
    return this.httpClient
      .get<{ ok: boolean; tipoMiembro: TipoMiembroModel[] }>(`${base_url}/tipomiembro`, this.headers)
      .pipe(
        map((respuesta) => {
          if (respuesta.ok) {
            return respuesta.tipoMiembro;
          } else {
            // Maneja el error según tus necesidades
            console.error('Error al obtener tipos de miembro:', respuesta);
            return [];
          }
        }),
        catchError((error) => {
          console.error('Error de solicitud HTTP:', error);
          return of([]); // Devuelve un arreglo vacío en caso de error
        })
      );
  }

  getUnTipoMiembro(id: number): Observable<TipoMiembroModel | null> {
    return this.httpClient
      .get<{ ok: boolean; tipoMiembro: TipoMiembroModel }>(`${base_url}/tipomiembro/${id}`, this.headers)
      .pipe(
        map((respuesta) => {
          if (respuesta.ok) {
            return respuesta.tipoMiembro;
          } else {
            // Maneja el error según tus necesidades
            console.error(`Error al obtener tipo de miembro con ID ${id}:`, respuesta);
            return null; // Devuelve null si no se encuentra el tipo de miembro
          }
        }),
        catchError((error) => {
          console.error('Error de solicitud HTTP:', error);
          return of(null); // Devuelve null en caso de error
        })
      );
  }

  crearTipoMiembro(tipoMiembro: TipoMiembroModel) {
    return this.httpClient.post(`${base_url}/tipomiembro`, tipoMiembro, this.headers);
  }

  actualizarTipoMiembro(tipoMiembro: TipoMiembroModel) {
    return this.httpClient.put(`${base_url}/tipomiembro/${tipoMiembro.id}`, tipoMiembro, this.headers);
  }

  eliminarYipoMiembro(tipoMiembro: TipoMiembroModel) {
    return this.httpClient.delete(`${base_url}/tipomiembro/${tipoMiembro.id}`, this.headers);
  }

  activarTipoMiembro(tipoMiembro: TipoMiembroModel) {
    return this.httpClient.put(`${base_url}/tipomiembro/activar/${tipoMiembro.id}`, tipoMiembro, this.headers);
  }
}
