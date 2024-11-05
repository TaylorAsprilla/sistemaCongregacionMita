import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LogroModel } from 'src/app/core/models/logro.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class LogroService {
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

  // Obtener todos los logros
  getLogros(): Observable<LogroModel[]> {
    return this.httpClient.get<{ ok: boolean; logros: LogroModel[] }>(`${base_url}/logro`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.logros;
        } else {
          throw new Error('No se pudieron obtener los logros');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Crear un nuevo logro
  crearLogro(logro: LogroModel): Observable<LogroModel> {
    return this.httpClient
      .post<LogroModel>(`${base_url}/logro`, logro, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un logro existente
  actualizarLogro(logro: LogroModel): Observable<LogroModel> {
    return this.httpClient
      .put<LogroModel>(`${base_url}/logro/${logro.id}`, logro, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
