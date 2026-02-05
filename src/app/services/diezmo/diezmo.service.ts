import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { DiezmoModel } from 'src/app/core/models/diezmo.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class DiezmoService {
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

  getDiezmos() {
    return this.httpClient
      .get(`${base_url}/diezmos/`, this.headers)
      .pipe(map((response: { ok: boolean; diezmos: DiezmoModel[] }) => response.diezmos || []));
  }

  getDiezmoById(id: number) {
    return this.httpClient
      .get(`${base_url}/diezmos/${id}`, this.headers)
      .pipe(map((response: { ok: boolean; diezmo: DiezmoModel }) => response.diezmo));
  }

  crearDiezmo(diezmo: DiezmoModel) {
    return this.httpClient.post(`${base_url}/diezmos`, diezmo, this.headers);
  }

  actualizarDiezmo(diezmo: DiezmoModel) {
    return this.httpClient.put(`${base_url}/diezmos/${diezmo.id}`, diezmo, this.headers);
  }

  eliminarDiezmo(id: number) {
    return this.httpClient.delete(`${base_url}/diezmos/${id}`, this.headers);
  }
}
