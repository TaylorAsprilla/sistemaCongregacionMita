import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { EstadoCivilModel } from 'src/app/models/estado-civil.model';
import { environment } from 'src/environments/environment';

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

  listarEstadoCivil() {
    return this.httpClient
      .get(`${base_url}/estadocivil`, this.headers)
      .pipe(map((estadoCivil: { ok: boolean; estadoCivil: EstadoCivilModel[] }) => estadoCivil.estadoCivil));
  }

  crearGenero(estadoCivil: EstadoCivilModel) {
    return this.httpClient.post(`${base_url}/estadocivil`, estadoCivil, this.headers);
  }

  actualizarGenero(estadoCivil: EstadoCivilModel) {
    return this.httpClient.put(`${base_url}/estadocivil/${estadoCivil.id}`, estadoCivil, this.headers);
  }
}
