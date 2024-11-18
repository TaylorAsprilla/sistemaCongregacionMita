import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { UsuariosPorCongregacionRespuesta } from 'src/app/core/interfaces/usuario.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuariosPorCongregacionService {
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

  listarUsuariosPorPais(idUsuario: number) {
    return this.httpClient
      .get<UsuariosPorCongregacionRespuesta>(
        `${base_url}/usuariocongregacion/pais?idUsuario=${idUsuario}`,
        this.headers
      )
      .pipe(
        map((respuesta) => {
          return { totalUsuarios: respuesta.totalUsuarios, usuarios: respuesta.usuarios };
        })
      );
  }

  listarUsuariosPorCongregacion(idUsuario: number) {
    return this.httpClient
      .get<UsuariosPorCongregacionRespuesta>(
        `${base_url}/usuariocongregacion/congregacion?idUsuario=${idUsuario}`,
        this.headers
      )
      .pipe(
        map((respuesta) => {
          return { totalUsuarios: respuesta.totalUsuarios, usuarios: respuesta.usuarios };
        })
      );
  }

  listarUsuariosPorCampo(desde: number = 0, idCongregacion: number) {
    return this.httpClient
      .get<UsuariosPorCongregacionRespuesta>(
        `${base_url}/usuariocongregacion/campo/?desde=${desde}&idCongregacion=${idCongregacion}`,
        this.headers
      )
      .pipe(
        map((respuesta) => {
          return { totalUsuarios: respuesta.totalUsuarios, usuarios: respuesta.usuarios };
        })
      );
  }
}
