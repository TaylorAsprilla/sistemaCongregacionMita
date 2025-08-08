import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CongregacionService {
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

  getCongregaciones() {
    return this.httpClient
      .get(`${base_url}/congregacion`, this.headers)
      .pipe(map((congregacion: { ok: boolean; congregacion: CongregacionModel[] }) => congregacion.congregacion));
  }

  getCongregacion(id: number) {
    return this.httpClient
      .get(`${base_url}/congregacion/${id}`, this.headers)
      .pipe(
        map((congregacion: { ok: boolean; congregacion: CongregacionModel; id: number }) => congregacion.congregacion)
      );
  }

  crearCongregacion(congregacion: CongregacionModel) {
    return this.httpClient.post(`${base_url}/congregacion`, congregacion, this.headers);
  }

  actualizarCongregacion(congregacion: CongregacionModel) {
    return this.httpClient.put(`${base_url}/congregacion/${congregacion.id}`, congregacion, this.headers);
  }

  eliminarCongregacion(congregacion: CongregacionModel) {
    return this.httpClient.delete(`${base_url}/congregacion/${congregacion.id}`, this.headers);
  }

  activarCongregacion(congregacion: CongregacionModel) {
    return this.httpClient.put(`${base_url}/congregacion/activar/${congregacion.id}`, congregacion, this.headers);
  }
}
