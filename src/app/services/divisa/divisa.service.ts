import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DivisaModel } from 'src/app/models/divisa.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class DivisaService {
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

  listarDivisa() {
    return this.httpClient
      .get(`${base_url}/divisa`, this.headers)
      .pipe(map((divisa: { ok: boolean; divisa: DivisaModel[] }) => divisa.divisa));
  }

  crearPais(divisa: DivisaModel) {
    return this.httpClient.post(`${base_url}/divisa`, divisa, this.headers);
  }

  actualizarPais(divisa: DivisaModel) {
    return this.httpClient.put(`${base_url}/divisa/${divisa.id}`, divisa, this.headers);
  }
}
