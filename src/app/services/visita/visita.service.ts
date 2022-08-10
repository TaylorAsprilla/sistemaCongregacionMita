import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { VisitaModel } from 'src/app/models/visita.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class VisitaService {
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

  getVisita() {
    return this.httpClient
      .get(`${base_url}/visita/`, this.headers)
      .pipe(map((visita: { ok: boolean; visitas: VisitaModel[] }) => visita.visitas));
  }

  crearVisita(visita: VisitaModel) {
    return this.httpClient.post(`${base_url}/visita`, visita, this.headers);
  }

  actualizarVisita(visita: VisitaModel) {
    return this.httpClient.put(`${base_url}/visita/${visita.id}`, this.headers);
  }
}
