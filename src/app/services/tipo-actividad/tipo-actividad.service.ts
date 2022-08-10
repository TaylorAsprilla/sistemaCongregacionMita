import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { TipoActividadModel } from 'src/app/models/tipo-actividad.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoActividadService {
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

  getTipoActividad() {
    return this.httpClient
      .get(`${base_url}/tipoactividad/`, this.headers)
      .pipe(map((tipoActividad: { ok: boolean; tipoActividad: TipoActividadModel[] }) => tipoActividad.tipoActividad));
  }

  crearTipoActividad(tipoActividad: TipoActividadModel) {
    return this.httpClient.post(`${base_url}/tipoactividad`, tipoActividad, this.headers);
  }

  elimiminarTipoActividad(tipoActividad: TipoActividadModel) {
    return this.httpClient.delete(`${base_url}/tipoactividad/${tipoActividad.id}`, this.headers);
  }
}
