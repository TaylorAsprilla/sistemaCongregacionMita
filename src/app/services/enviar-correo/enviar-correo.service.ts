import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class EnviarCorreoService {
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

  correoDeBienvenida(idUsuario: number) {
    return this.httpClient.post(`${base_url}/email/${idUsuario}`, {}, this.headers);
  }
}
