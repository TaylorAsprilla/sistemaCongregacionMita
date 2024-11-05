import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { Observable, throwError } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PaisService {
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

  // Obtener todos los países
  getPaises(): Observable<CongregacionPaisModel[]> {
    return this.httpClient.get<{ ok: boolean; pais: CongregacionPaisModel[] }>(`${base_url}/pais`, this.headers).pipe(
      map((response) => (response.ok ? response.pais : [])),
      catchError(this.handleError)
    );
  }

  // Obtener un país por su ID
  getPais(id: number): Observable<CongregacionPaisModel | null> {
    return this.httpClient
      .get<{ ok: boolean; pais: CongregacionPaisModel }>(`${base_url}/pais/${id}`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.pais : null)),
        catchError(this.handleError)
      );
  }

  // Crear un nuevo país
  crearPais(pais: CongregacionPaisModel): Observable<CongregacionPaisModel> {
    return this.httpClient
      .post<CongregacionPaisModel>(`${base_url}/pais`, pais, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un país
  actualizarPais(pais: CongregacionPaisModel): Observable<CongregacionPaisModel> {
    return this.httpClient
      .put<CongregacionPaisModel>(`${base_url}/pais/${pais.id}`, pais, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un país
  eliminarPais(pais: CongregacionPaisModel): Observable<void> {
    return this.httpClient.delete<void>(`${base_url}/pais/${pais.id}`, this.headers).pipe(catchError(this.handleError));
  }

  // Activar un país
  activarPais(pais: CongregacionPaisModel): Observable<CongregacionPaisModel> {
    return this.httpClient
      .put<CongregacionPaisModel>(`${base_url}/pais/activar/${pais.id}`, pais, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
