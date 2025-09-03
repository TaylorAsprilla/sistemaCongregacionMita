import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { CampoModel } from 'src/app/core/models/campo.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CampoService {
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

  getCampos() {
    return this.httpClient
      .get(`${base_url}/campo`, this.headers)
      .pipe(map((campo: { ok: boolean; campo: CampoModel[] }) => campo.campo));
  }

  getCampo(id: number) {
    return this.httpClient
      .get(`${base_url}/campo/${id}`, this.headers)
      .pipe(map((campo: { ok: boolean; campo: CampoModel; id: number }) => campo.campo));
  }

  crearCampo(campo: CampoModel) {
    return this.httpClient.post(`${base_url}/campo`, campo, this.headers);
  }

  actualizarCampo(campo: CampoModel) {
    return this.httpClient.put(`${base_url}/campo/${campo.id}`, campo, this.headers);
  }

  eliminarCampo(campo: CampoModel) {
    return this.httpClient.delete(`${base_url}/campo/${campo.id}`, this.headers);
  }

  activarCampo(campo: CampoModel) {
    return this.httpClient.put(`${base_url}/campo/activar/${campo.id}`, campo, this.headers);
  }
}
