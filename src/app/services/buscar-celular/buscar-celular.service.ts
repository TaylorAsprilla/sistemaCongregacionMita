import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BuscarCelularService {
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

  // buscarcelular(numeroCelular: string, idUsuario: number) {
  //   console.log(idUsuario);
  //   return this.httpClient.get(
  //     `${base_url}/buscarcelular?numeroCelular=${numeroCelular}&idUsuario=${idUsuario}`,
  //     this.headers
  //   );
  // }

  buscarcelular(numeroCelular: string) {
    return this.httpClient.get(`${base_url}/buscarcelular?numeroCelular=${numeroCelular}`, this.headers);
  }
}
