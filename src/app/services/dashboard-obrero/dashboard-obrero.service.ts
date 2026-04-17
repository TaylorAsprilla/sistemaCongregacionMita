import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environment';
import { DashboardObreroResponse } from 'src/app/core/interfaces/dashboard-obrero.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class DashboardObreroService {
  private httpClient = inject(HttpClient);

  get token(): string {
    return localStorage.getItem('x-token') || localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  /**
   * Obtiene los usuarios completos para el dashboard de obrero
   * @param idUsuario ID del usuario (obrero o administrador)
   * @returns Observable con la respuesta del endpoint
   */
  getUsuariosCompleto(idUsuario: number): Observable<DashboardObreroResponse> {
    const url = `${base_url}/usuarios/completo?idUsuario=${idUsuario}`;

    return this.httpClient.get<DashboardObreroResponse>(url, this.headers).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Dashboard Service - Error HTTP:', error);
        console.error('Dashboard Service - Status:', error.status);
        console.error('Dashboard Service - Message:', error.message);
        console.error('Dashboard Service - Error completo:', error.error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Valida si existe el token en localStorage
   * @returns true si existe el token, false en caso contrario
   */
  validateToken(): boolean {
    return !!this.token;
  }
}
