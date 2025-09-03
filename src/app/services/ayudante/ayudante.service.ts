import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { UsuariosPorCongregacionRespuesta } from 'src/app/core/interfaces/usuario.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AyudanteService {
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

  listarUsuariosPorIdUsuario(idUsuario: number) {
    return this.httpClient
      .get<UsuariosPorCongregacionRespuesta>(`${base_url}/ayudante/?idUsuario=${idUsuario}`, this.headers)
      .pipe(
        map((respuesta) => {
          return { totalUsuarios: respuesta.totalUsuarios, usuarios: respuesta.usuarios };
        })
      );
  }
}
