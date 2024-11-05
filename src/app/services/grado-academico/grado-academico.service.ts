import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class GradoAcademicoService {
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

  getGradosAcademicos(): Observable<GradoAcademicoModel[]> {
    return this.httpClient
      .get<{ ok: boolean; gradoAcademico: GradoAcademicoModel[] }>(`${base_url}/gradoacademico`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.gradoAcademico;
          } else {
            throw new Error('No se pudieron obtener los grados académicos');
          }
        }),
        catchError(this.handleError)
      );
  }

  getUnGradoAcademico(id: number): Observable<GradoAcademicoModel> {
    return this.httpClient
      .get<{ ok: boolean; gradoAcademico: GradoAcademicoModel }>(`${base_url}/gradoacademico/${id}`, this.headers)
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.gradoAcademico;
          } else {
            throw new Error('No se pudo obtener el grado académico');
          }
        }),
        catchError(this.handleError)
      );
  }

  crearGradoAcademico(gradoAcademico: string): Observable<GradoAcademicoModel> {
    return this.httpClient
      .post<GradoAcademicoModel>(`${base_url}/gradoAcademico`, { gradoAcademico }, this.headers)
      .pipe(catchError(this.handleError));
  }

  actualizarGradoAcademico(gradoAcademico: GradoAcademicoModel): Observable<GradoAcademicoModel> {
    return this.httpClient
      .put<GradoAcademicoModel>(`${base_url}/gradoAcademico/${gradoAcademico.id}`, gradoAcademico, this.headers)
      .pipe(catchError(this.handleError));
  }

  eliminarGradoAcademico(gradoAcademico: GradoAcademicoModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/gradoacademico/${gradoAcademico.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  activarGradoAcademico(gradoAcademico: GradoAcademicoModel): Observable<GradoAcademicoModel> {
    return this.httpClient
      .put<GradoAcademicoModel>(`${base_url}/gradoAcademico/activar/${gradoAcademico.id}`, gradoAcademico, this.headers)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
