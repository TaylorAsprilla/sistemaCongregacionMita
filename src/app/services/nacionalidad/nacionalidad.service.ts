import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class NacionalidadService {
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

  getNacionalidades() {
    return this.httpClient
      .get(`${base_url}/nacionalidad`, this.headers)
      .pipe(map((nacionalidad: { ok: boolean; nacionalidades: NacionalidadModel[] }) => nacionalidad.nacionalidades));
  }

  getNacionalidad(id: string) {
    return this.httpClient
      .get(`${base_url}/nacionalidad/${id}`, this.headers)
      .pipe(map((nacionalidad: { ok: boolean; nacionalidad: NacionalidadModel }) => nacionalidad.nacionalidad));
  }
}
