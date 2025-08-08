import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { MetaModel } from 'src/app/core/models/meta.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MetaService {
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

  getMetas() {
    return this.httpClient
      .get(`${base_url}/meta`, this.headers)
      .pipe(map((meta: { ok: boolean; metas: MetaModel[] }) => meta.metas));
  }

  getMeta(id: number) {
    return this.httpClient
      .get(`${base_url}/meta/${id}`, this.headers)
      .pipe(map((meta: { ok: boolean; meta: MetaModel }) => meta.meta));
  }

  crearMeta(meta: MetaModel) {
    return this.httpClient.post(`${base_url}/meta`, meta, this.headers);
  }

  actualizarMeta(meta: MetaModel) {
    return this.httpClient.put(`${base_url}/meta/${meta.id}`, this.headers);
  }
}
