import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ObreroInterface, ObreroModel } from 'src/app/core/models/obrero.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ObreroService {
  constructor(private httpClient: HttpClient, private router: Router) {}

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

  // Obtener todos los obreros
  getObreros(): Observable<ObreroInterface[]> {
    return this.httpClient.get<{ ok: boolean; obreros: ObreroInterface[] }>(`${base_url}/obrero`, this.headers).pipe(
      map((response) => (response.ok ? response.obreros : [])),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
