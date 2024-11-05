import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { ActividadModel } from 'src/app/core/models/actividad.model';
import { throwError } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ActividadService {
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

  getActividad() {
    return this.httpClient
      .get<{ ok: boolean; actividad: ActividadModel[] }>(`${base_url}/actividad/`, this.headers)
      .pipe(map((response) => response.actividad));
  }

  crearActividad(actividad: ActividadModel) {
    return this.httpClient.post(`${base_url}/actividad`, actividad, this.headers);
  }

  actualizarActividad(actividad: ActividadModel) {
    return this.httpClient
      .put(`${base_url}/actividad/${actividad.id}`, actividad, this.headers)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Aquí puedes agregar lógica para manejar errores
    console.error('Error en la petición HTTP', error);
    return throwError('Ocurrió un error, por favor intenta nuevamente.');
  }
}
