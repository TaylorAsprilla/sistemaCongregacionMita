import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class EstadoCivilService {
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

  getEstadoCiviles() {
    return this.httpClient
      .get(`${base_url}/estadocivil`, this.headers)
      .pipe(map((estadoCivil: { ok: boolean; estadoCivil: EstadoCivilModel[] }) => estadoCivil.estadoCivil));
  }

  getEstadoCivil(id: number) {
    return this.httpClient
      .get(`${base_url}/estadocivil/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; estadocivil: EstadoCivilModel }) => respuesta.estadocivil));
  }

  crearEstadoCivil(estadoCivil: string) {
    return this.httpClient.post(`${base_url}/estadoCivil`, { estadoCivil: estadoCivil }, this.headers);
  }

  actualizarEstadoCivil(estadoCivil: EstadoCivilModel) {
    return this.httpClient.put(`${base_url}/estadocivil/${estadoCivil.id}`, estadoCivil, this.headers);
  }

  elimiminarEstadoCivil(estadoCivil: EstadoCivilModel) {
    return this.httpClient.delete(`${base_url}/estadocivil/${estadoCivil.id}`, this.headers);
  }

  activarEstadoCivil(estadoCivil: EstadoCivilModel) {
    return this.httpClient.put(`${base_url}/estadocivil/activar/${estadoCivil.id}`, estadoCivil, this.headers);
  }
}
