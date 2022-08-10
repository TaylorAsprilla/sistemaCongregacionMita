import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { MetaModel } from 'src/app/models/meta.model';

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

  getMeta() {
    return this.httpClient
      .get(`${base_url}/meta/`, this.headers)
      .pipe(map((meta: { ok: boolean; meta: MetaModel[] }) => meta.meta));
  }

  crearMeta(meta: MetaModel) {
    return this.httpClient.post(`${base_url}/meta`, meta, this.headers);
  }

  actualizarMeta(meta: MetaModel) {
    return this.httpClient.put(`${base_url}/meta/${meta.id}`, this.headers);
  }
}
