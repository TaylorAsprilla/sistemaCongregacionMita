import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { MetaModel } from 'src/app/core/models/meta.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MetaService {
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

  getMetas() {
    return this.httpClient
      .get(`${base_url}/meta`, this.headers)
      .pipe(map((meta: { ok: boolean; metas: MetaModel[] }) => meta.metas));
  }

  getMeta(id: number) {
    return this.httpClient
      .get(`${base_url}/meta/${id}`, this.headers)
      .pipe(map((meta: { ok: boolean; meta: MetaModel[] }) => meta.meta));
  }

  // getPais(id: number) {
  //   return this.httpClient
  //     .get(`${base_url}/pais/${id}`, this.headers)
  //     .pipe(map((pais: { ok: boolean; pais: PaisModel; id: number }) => pais.pais));
  // }

  crearMeta(meta: MetaModel) {
    return this.httpClient.post(`${base_url}/meta`, meta, this.headers);
  }

  actualizarMeta(meta: MetaModel) {
    return this.httpClient.put(`${base_url}/meta/${meta.id}`, this.headers);
  }
}
