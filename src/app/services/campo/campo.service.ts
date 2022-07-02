import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CampoModel } from 'src/app/models/campo.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CampoService {
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

  listarCampo() {
    return this.httpClient
      .get(`${base_url}/campo`, this.headers)
      .pipe(map((campo: { ok: boolean; campo: CampoModel[] }) => campo.campo));
  }

  crearCampo(campo: CampoModel) {
    return this.httpClient.post(`${base_url}/campo`, campo, this.headers);
  }

  actualizarCampo(campo: CampoModel) {
    return this.httpClient.put(`${base_url}/campo/${campo.id}`, campo, this.headers);
  }
}
