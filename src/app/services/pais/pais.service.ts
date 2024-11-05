import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class PaisService {
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

  getPaises() {
    return this.httpClient
      .get(`${base_url}/pais`, this.headers)
      .pipe(map((pais: { ok: boolean; pais: CongregacionPaisModel[] }) => pais.pais));
  }

  getPais(id: number) {
    return this.httpClient
      .get(`${base_url}/pais/${id}`, this.headers)
      .pipe(map((pais: { ok: boolean; pais: CongregacionPaisModel; id: number }) => pais.pais));
  }

  crearPais(pais: CongregacionPaisModel) {
    return this.httpClient.post(`${base_url}/pais`, pais, this.headers);
  }

  actualizarPais(pais: CongregacionPaisModel) {
    return this.httpClient.put(`${base_url}/pais/${pais.id}`, pais, this.headers);
  }

  eliminarPais(pais: CongregacionPaisModel) {
    return this.httpClient.delete(`${base_url}/pais/${pais.id}`, this.headers);
  }

  activarPais(pais: CongregacionPaisModel) {
    return this.httpClient.put(`${base_url}/pais/activar/${pais.id}`, pais, this.headers);
  }
}
