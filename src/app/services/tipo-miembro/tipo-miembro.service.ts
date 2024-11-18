import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class TipoMiembroService {
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

  getTipoMiembro() {
    return this.httpClient
      .get(`${base_url}/tipomiembro`, this.headers)
      .pipe(map((respuesta: { ok: boolean; tipoMiembro: TipoMiembroModel[] }) => respuesta.tipoMiembro));
  }

  getUnTipoMiembro(id: number) {
    return this.httpClient
      .get(`${base_url}/tipomiembro/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; tipoMiembro: TipoMiembroModel }) => respuesta.tipoMiembro));
  }

  crearTipoMiembro(tipoMiembro: TipoMiembroModel) {
    return this.httpClient.post(`${base_url}/tipomiembro`, tipoMiembro, this.headers);
  }

  actualizarTipoMiembro(tipoMiembro: TipoMiembroModel) {
    return this.httpClient.put(`${base_url}/tipomiembro/${tipoMiembro.id}`, tipoMiembro, this.headers);
  }

  eliminarTipoMiembro(tipoMiembro: TipoMiembroModel) {
    return this.httpClient.delete(`${base_url}/tipomiembro/${tipoMiembro.id}`, this.headers);
  }

  activarTipoMiembro(tipoMiembro: TipoMiembroModel) {
    return this.httpClient.put(`${base_url}/tipomiembro/activar/${tipoMiembro.id}`, tipoMiembro, this.headers);
  }
}
