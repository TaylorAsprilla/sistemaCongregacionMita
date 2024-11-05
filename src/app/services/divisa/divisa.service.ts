import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DivisaModel } from 'src/app/core/models/divisa.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class DivisaService {
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

  // Listar todas las divisas
  listarDivisa(): Observable<DivisaModel[]> {
    return this.httpClient.get<{ ok: boolean; divisa: DivisaModel[] }>(`${base_url}/divisa`, this.headers).pipe(
      map((response) => {
        if (response.ok) {
          return response.divisa;
        } else {
          throw new Error('No se pudieron obtener las divisas');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Crear una nueva divisa
  crearDivisa(divisa: DivisaModel): Observable<DivisaModel> {
    return this.httpClient
      .post<DivisaModel>(`${base_url}/divisa`, divisa, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar una divisa existente
  actualizarDivisa(divisa: DivisaModel): Observable<DivisaModel> {
    return this.httpClient
      .put<DivisaModel>(`${base_url}/divisa/${divisa.id}`, divisa, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
