import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class EstadoCivilService {
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

  // Obtener todos los estados civiles
  getEstadoCiviles(): Observable<EstadoCivilModel[]> {
    return this.httpClient
      .get<{ ok: boolean; estadoCivil: EstadoCivilModel[] }>(`${base_url}/estadocivil`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.estadoCivil;
          } else {
            throw new Error('No se pudieron obtener los estados civiles');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener un estado civil por ID
  getEstadoCivil(id: number): Observable<EstadoCivilModel> {
    return this.httpClient
      .get<{ ok: boolean; estadocivil: EstadoCivilModel }>(`${base_url}/estadocivil/${id}`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.estadocivil;
          } else {
            throw new Error('No se pudo obtener el estado civil');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Crear un nuevo estado civil
  crearEstadoCivil(estadoCivil: string): Observable<EstadoCivilModel> {
    return this.httpClient
      .post<EstadoCivilModel>(`${base_url}/estadoCivil`, { estadoCivil: estadoCivil }, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un estado civil existente
  actualizarEstadoCivil(estadoCivil: EstadoCivilModel): Observable<EstadoCivilModel> {
    return this.httpClient
      .put<EstadoCivilModel>(`${base_url}/estadocivil/${estadoCivil.id}`, estadoCivil, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un estado civil
  eliminarEstadoCivil(estadoCivil: EstadoCivilModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/estadocivil/${estadoCivil.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Activar un estado civil
  activarEstadoCivil(estadoCivil: EstadoCivilModel): Observable<EstadoCivilModel> {
    return this.httpClient
      .put<EstadoCivilModel>(`${base_url}/estadocivil/activar/${estadoCivil.id}`, estadoCivil, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
