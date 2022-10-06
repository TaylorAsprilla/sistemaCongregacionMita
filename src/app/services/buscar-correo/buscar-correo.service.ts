import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BuscarCorreoService {
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

  buscarCorreo(email: string) {
    return this.httpClient.get(`${base_url}/buscarcorreo?email=${email}`, this.headers);
  }
}
