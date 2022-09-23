import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { ContabilidadModel } from 'src/app/core/models/contabilidad.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ContabilidadService {
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

  getContabilidad() {
    return this.httpClient
      .get(`${base_url}/contabilidad/`, this.headers)
      .pipe(map((contabilidad: { ok: boolean; contabilidad: ContabilidadModel[] }) => contabilidad.contabilidad));
  }

  getUnaContabilidad(contabilidad: ContabilidadModel) {
    return this.httpClient
      .get(`${base_url}/contabilidad/${contabilidad.id}`, this.headers)
      .pipe(map((contabilidad: { ok: boolean; contabilidad: ContabilidadModel[] }) => contabilidad.contabilidad));
  }

  crearContabilidad(contabilidad: ContabilidadModel) {
    return this.httpClient.post(`${base_url}/contabilidad`, contabilidad, this.headers);
  }

  actualizarContabilidad(contabilidad: ContabilidadModel) {
    return this.httpClient.put(`${base_url}/contabilidad/${contabilidad.id}`, this.headers);
  }
}
