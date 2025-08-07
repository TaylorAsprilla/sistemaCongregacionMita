import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { LogroModel } from 'src/app/core/models/logro.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class LogroService {
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

  getLogros() {
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
