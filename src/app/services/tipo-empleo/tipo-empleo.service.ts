import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { TipoEmpleoModel } from 'src/app/core/models/tipo-empleo.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class TipoEmpleoService {
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

  getTipoDeEmpleos() {
    return this.httpClient
      .get(`${base_url}/tipoempleo`, this.headers)
      .pipe(map((respuesta: { ok: boolean; tipoEmpleo: TipoEmpleoModel[] }) => respuesta.tipoEmpleo));
  }

  getUnTipoDeEmpleo(id: number) {
    return this.httpClient
      .get(`${base_url}/tipoempleo/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; tipoEmpleo: TipoEmpleoModel }) => respuesta.tipoEmpleo));
  }

  crearTipoEmpleo(tipoEmpleo: TipoEmpleoModel) {
    return this.httpClient.post(`${base_url}/tipoempleo`, tipoEmpleo, this.headers);
  }

  actualizarTipoEmpleo(tipoEmpleo: TipoEmpleoModel) {
    return this.httpClient.put(`${base_url}/tipoempleo/${tipoEmpleo.id}`, tipoEmpleo, this.headers);
  }

  eliminarTipoEmpleo(tipoEmpleo: TipoEmpleoModel) {
    return this.httpClient.delete(`${base_url}/tipoempleo/${tipoEmpleo.id}`, this.headers);
  }

  activarTipoEmpleo(tipoEmpleo: TipoEmpleoModel) {
    return this.httpClient.put(`${base_url}/tipoempleo/activar/${tipoEmpleo.id}`, tipoEmpleo, this.headers);
  }
}
