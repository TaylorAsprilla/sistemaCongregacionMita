import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DosisModel } from 'src/app/models/dosis.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class DosisService {
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

  listarDosis() {
    return this.httpClient
      .get(`${base_url}/dosis`, this.headers)
      .pipe(map((dosis: { ok: boolean; dosis: DosisModel[] }) => dosis.dosis));
  }

  crearDosis(dosis: DosisModel) {
    return this.httpClient.post(`${base_url}/dosis`, dosis, this.headers);
  }

  actualizarDosis(dosis: DosisModel) {
    return this.httpClient.put(`${base_url}/dosis/${dosis.id}`, dosis, this.headers);
  }
}
