import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/models/congregacion.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CongregacionService {
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

  listarCongregacion() {
    return this.httpClient
      .get(`${base_url}/congregacion`, this.headers)
      .pipe(map((congregacion: { ok: boolean; congregacion: CongregacionModel[] }) => congregacion.congregacion));
  }

  crearCongregacion(congregacion: CongregacionModel) {
    return this.httpClient.post(`${base_url}/congregacion`, congregacion, this.headers);
  }

  actualizarCongregacion(congregacion: CongregacionModel) {
    return this.httpClient.put(`${base_url}/congregacion/${congregacion.id}`, congregacion, this.headers);
  }
}
