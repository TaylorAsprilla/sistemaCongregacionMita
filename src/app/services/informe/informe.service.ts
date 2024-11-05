import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { InformeModel } from 'src/app/core/models/informe.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class InformeService {
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

  // Todos los informes
  getInformes() {
    return this.httpClient
      .get(`${base_url}/informe`, this.headers)
      .pipe(map((informe: { ok: boolean; informes: InformeModel[] }) => informe.informes));
  }

  getInforme(id: number) {
    return this.httpClient
      .get(`${base_url}/informe/${id}`, this.headers)
      .pipe(map((informe: { ok: boolean; informe: any[] }) => informe.informe));
  }

  crearInforme(informe: InformeModel) {
    return this.httpClient.post(`${base_url}/informe`, informe, this.headers);
  }

  actualizarInforme(informe: InformeModel) {
    return this.httpClient.put(`${base_url}/informe/${informe.id}`, informe, this.headers);
  }
}
