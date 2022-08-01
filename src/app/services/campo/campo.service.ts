import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CampoModel } from 'src/app/models/campo.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CampoService {
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

  listarCampo() {
    return this.httpClient
      .get(`${base_url}/campo`, this.headers)
      .pipe(map((campo: { ok: boolean; campo: CampoModel[] }) => campo.campo));
  }

  getCampo(id: string) {
    return this.httpClient
      .get(`${base_url}/campo/${id}`, this.headers)
      .pipe(map((campo: { ok: boolean; pais: CampoModel; id: number }) => campo.pais)); // ajustar a campo
  }

  // getCongregacion(id: string) {
  //   return this.httpClient
  //     .get(`${base_url}/congregacion/${id}`, this.headers)
  //     .pipe(
  //       map((congregacion: { ok: boolean; congregacion: CongregacionModel; id: number }) => congregacion.congregacion)
  //     );
  // }

  crearCampo(campo: CampoModel) {
    return this.httpClient.post(`${base_url}/campo`, campo, this.headers);
  }

  actualizarCampo(campo: CampoModel) {
    return this.httpClient.put(`${base_url}/campo/${campo.id}`, campo, this.headers);
  }

  eliminarCampo(campo: CampoModel) {
    return this.httpClient.delete(`${base_url}/campo/${campo.id}`, this.headers);
  }

  activarCampo(campo: CampoModel) {
    return this.httpClient.put(`${base_url}/campo/activar/${campo.id}`, campo, this.headers);
  }
}
