import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class RolCasaService {
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
  getRolCasa() {
    return this.httpClient
      .get(`${base_url}/rolcasa`, this.headers)
      .pipe(map((rolCasa: { ok: boolean; rolCasa: RolCasaModel[] }) => rolCasa.rolCasa));
  }

  crearRolCasa(rolCasa: RolCasaModel) {
    return this.httpClient.post(`${base_url}/rolcasa`, rolCasa, this.headers);
  }

  actualizarRolCasa(rolCasa: RolCasaModel) {
    return this.httpClient.put(`${base_url}/rolcasa/${rolCasa.id}`, rolCasa, this.headers);
  }
}
