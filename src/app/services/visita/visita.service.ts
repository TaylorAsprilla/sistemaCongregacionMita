import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { VisitaModel } from 'src/app/core/models/visita.model';
import { environment } from 'src/environments/environment';

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

  getVisita(): Observable<VisitaModel[]> {
    return this.httpClient
      .get<{ ok: boolean; visitas: VisitaModel[] }>(`${base_url}/visita/`, this.headers)
      .pipe(map((respuesta) => respuesta.visitas));
  }

  crearVisita(visita: VisitaModel) {
    return this.httpClient.post(`${base_url}/visita`, visita, this.headers);
  }

  actualizarVisita(visita: VisitaModel) {
    return this.httpClient.put(`${base_url}/visita/${visita.id}`, this.headers);
  }
}
