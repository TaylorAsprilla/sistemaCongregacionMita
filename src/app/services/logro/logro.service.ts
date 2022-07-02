import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LogroModel } from 'src/app/models/logro.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class LogroService {
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

  listarLogros() {
    return this.httpClient
      .get(`${base_url}/logro`, this.headers)
      .pipe(map((logros: { ok: boolean; logros: LogroModel[] }) => logros.logros));
  }

  crearLogro(logro: LogroModel) {
    return this.httpClient.post(`${base_url}/logro`, logro, this.headers);
  }

  actualizarLogro(logro: LogroModel) {
    return this.httpClient.put(`${base_url}/logro/${logro.id}`, logro, this.headers);
  }
}
