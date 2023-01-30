import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';

import { TipoEstudioModel } from 'src/app/core/models/tipo-estudio.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoEstudioService {
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

  getTipoEstudio() {
    return this.httpClient
      .get(`${base_url}/tipoestudio`, this.headers)
      .pipe(map((respuesta: { ok: boolean; tipoEstudio: TipoEstudioModel[] }) => respuesta.tipoEstudio));
  }

  getUnTipoEstudio(id: number) {
    return this.httpClient
      .get(`${base_url}/tipoestudio/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; tipoEstudio: TipoEstudioModel }) => respuesta.tipoEstudio));
  }

  // crearTipoEstudio(tipoEstudio: TipoEstudioModel) {
  //   return this.httpClient.post(`${base_url}/tipoestudio`, tipoEstudio, this.headers);
  // }

  crearTipoEstudio(tipoEstudio: string) {
    return this.httpClient.post(`${base_url}/tipoestudio`, { estudio: tipoEstudio }, this.headers);
  }

  actualizarTipoEstudio(tipoEstudio: TipoEstudioModel) {
    return this.httpClient.put(`${base_url}/tipoestudio/${tipoEstudio.id}`, tipoEstudio, this.headers);
  }

  eliminarTipoEmpleo(tipoEstudio: TipoEstudioModel) {
    return this.httpClient.delete(`${base_url}/tipoestudio/${tipoEstudio.id}`, this.headers);
  }

  activarTipoEmpleo(tipoEstudio: TipoEstudioModel) {
    return this.httpClient.put(`${base_url}/tipoestudio/activar/${tipoEstudio.id}`, tipoEstudio, this.headers);
  }
}
