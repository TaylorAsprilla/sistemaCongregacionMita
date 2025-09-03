import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { EstatusModel } from 'src/app/core/models/estatus.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class EstatusService {
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

  getEstatus() {
    return this.httpClient
      .get(`${base_url}/tipostatus/`, this.headers)
      .pipe(map((tipostatus: { ok: boolean; tipoStatus: EstatusModel[] }) => tipostatus.tipoStatus));
  }

  crearEstatus(estatus: EstatusModel) {
    return this.httpClient.post(`${base_url}/tipostatus`, estatus, this.headers);
  }

  actualizarEstatus(estatus: EstatusModel) {
    return this.httpClient.put(`${base_url}/tipostatus/${estatus.id}`, this.headers);
  }
}
