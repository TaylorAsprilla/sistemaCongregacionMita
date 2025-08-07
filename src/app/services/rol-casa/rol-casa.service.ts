import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class RolCasaService {
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
  getRolCasa() {
    return this.httpClient
      .get(`${base_url}/rolcasa`, this.headers)
      .pipe(map((rolCasa: { ok: boolean; rolCasa: RolCasaModel[] }) => rolCasa.rolCasa));
  }

  getUnRolCasa(id: number) {
    return this.httpClient
      .get(`${base_url}/rolcasa/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; rolcasa: RolCasaModel }) => respuesta.rolcasa));
  }

  crearRolCasa(rolCasa: string) {
    return this.httpClient.post(`${base_url}/rolCasa`, { rolCasa: rolCasa }, this.headers);
  }

  actualizarRolCasa(rolCasa: RolCasaModel) {
    return this.httpClient.put(`${base_url}/rolcasa/${rolCasa.id}`, rolCasa, this.headers);
  }

  eliminarRolCasa(rolCasa: RolCasaModel) {
    return this.httpClient.delete(`${base_url}/rolcasa/${rolCasa.id}`, this.headers);
  }

  activarRolCasa(rolCasa: RolCasaModel) {
    return this.httpClient.put(`${base_url}/rolcasa/activar/${rolCasa.id}`, rolCasa, this.headers);
  }
}
