import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SituacionVisitaService {
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

  getSituacionVisita() {
    return this.httpClient
      .get(`${base_url}/situacionvisita/`, this.headers)
      .pipe(
        map(
          (situacionVisita: { ok: boolean; situacionVisitas: SituacionVisitaModel[] }) =>
            situacionVisita.situacionVisitas
        )
      );
  }

  crearSituacionVisita(situacionVisita: SituacionVisitaModel) {
    return this.httpClient.post(`${base_url}/situacionvisita`, situacionVisita, this.headers);
  }

  actualizarSituacionVisita(situacionVisita: SituacionVisitaModel) {
    return this.httpClient.put(`${base_url}/situacionvisita/${situacionVisita.id}`, this.headers);
  }
}
