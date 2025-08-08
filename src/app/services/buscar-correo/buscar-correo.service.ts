import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BuscarCorreoService {
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

  buscarCorreoUsuario(email: string, idUsuario: number = null) {
    return this.httpClient.get(`${base_url}/buscarcorreo?email=${email}&idUsuario=${idUsuario}`, this.headers);
  }

  // buscarCorreoUsuario(email: string) {
  // return this.httpClient.get(`${base_url}/usuarios/buscarcorreo/${email}`, this.headers);
  // }

  buscarCorreoSolicitud(email: string) {
    return this.httpClient.get(`${base_url}/solicitudmultimedia/buscarcorreo/${email}`, this.headers);
  }
}
