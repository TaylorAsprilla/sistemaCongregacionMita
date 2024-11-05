import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';
import { Observable, throwError } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ParentescoService {
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

  // Obtener todos los parentescos
  getParentesco(): Observable<ParentescoModel[]> {
    return this.httpClient
      .get<{ ok: boolean; parentesco: ParentescoModel[] }>(`${base_url}/parentesco`, this.headers)
      .pipe(
        map((respuesta) => (respuesta.ok ? respuesta.parentesco : [])),
        catchError(this.handleError)
      );
  }

  // Obtener un parentesco por ID
  getUnParentesco(id: number): Observable<ParentescoModel | null> {
    return this.httpClient
      .get<{ ok: boolean; parentesco: ParentescoModel }>(`${base_url}/parentesco/${id}`, this.headers)
      .pipe(
        map((respuesta) => (respuesta.ok ? respuesta.parentesco : null)),
        catchError(this.handleError)
      );
  }

  // Crear un nuevo parentesco
  crearParentesco(parentesco: ParentescoModel): Observable<ParentescoModel> {
    return this.httpClient
      .post<ParentescoModel>(`${base_url}/parentesco`, parentesco, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un parentesco
  actualizarParentesco(parentesco: ParentescoModel): Observable<ParentescoModel> {
    return this.httpClient
      .put<ParentescoModel>(`${base_url}/parentesco/${parentesco.id}`, parentesco, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un parentesco
  eliminarParentesco(parentesco: ParentescoModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/parentesco/${parentesco.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Activar un parentesco
  activarParentesco(parentesco: ParentescoModel): Observable<ParentescoModel> {
    return this.httpClient
      .put<ParentescoModel>(`${base_url}/parentesco/activar/${parentesco.id}`, parentesco, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Error en la solicitud. Inténtelo más tarde.'));
  }
}
