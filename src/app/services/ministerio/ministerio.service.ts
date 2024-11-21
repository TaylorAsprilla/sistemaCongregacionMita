import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class MinisterioService {
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

  getMinisterios() {
    return this.httpClient
      .get(`${base_url}/ministerio`, this.headers)
      .pipe(map((ministerio: { ok: boolean; ministerio: MinisterioModel[] }) => ministerio.ministerio));
  }

  getMinisterio(id: number) {
    return this.httpClient
      .get(`${base_url}/ministerio/${id}`, this.headers)
      .pipe(map((ministerio: { ok: boolean; ministerio: MinisterioModel; id: number }) => ministerio.ministerio));
  }

  crearMinisterio(ministerio: MinisterioModel) {
    return this.httpClient.post(`${base_url}/ministerio`, ministerio, this.headers);
  }

  actualizarMinisterio(ministerio: MinisterioModel) {
    return this.httpClient.put(`${base_url}/ministerio/${ministerio.id}`, ministerio, this.headers);
  }

  eliminarMinisterio(ministerio: MinisterioModel) {
    return this.httpClient.delete(`${base_url}/ministerio/${ministerio.id}`, this.headers);
  }

  activarMinisterio(ministerio: MinisterioModel) {
    return this.httpClient.put(`${base_url}/ministerio/activar/${ministerio.id}`, ministerio, this.headers);
  }
}
