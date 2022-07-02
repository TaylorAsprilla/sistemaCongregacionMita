import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PaisModel } from 'src/app/models/pais.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class PaisService {
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

  listarPais() {
    return this.httpClient
      .get(`${base_url}/pais`, this.headers)
      .pipe(map((pais: { ok: boolean; pais: PaisModel[] }) => pais.pais));
  }

  crearPais(pais: PaisModel) {
    return this.httpClient.post(`${base_url}/pais`, pais, this.headers);
  }

  actualizarPais(pais: PaisModel) {
    return this.httpClient.put(`${base_url}/pais/${pais.id}`, pais, this.headers);
  }
}
