import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { ActividadModel } from 'src/app/core/models/actividad.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ActividadService {
  private httpClient = inject(HttpClient);

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
      .get(`${base_url}/actividad/`, this.headers)
      .pipe(map((actividad: { ok: boolean; actividad: ActividadModel[] }) => actividad.actividad));
  }

  crearActividad(actividad: ActividadModel) {
    return this.httpClient.post(`${base_url}/actividad`, actividad, this.headers);
  }

  actualizarActividad(actividad: ActividadModel) {
    return this.httpClient.put(`${base_url}/actividad/${actividad.id}`, this.headers);
  }
}
