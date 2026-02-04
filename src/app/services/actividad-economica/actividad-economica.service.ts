import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { ActividadEconomicaModel } from 'src/app/core/models/actividad-economica.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ActividadEconomicaService {
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

  getActividadEconomica() {
    return this.httpClient
      .get(`${base_url}/actividadeconomica/`, this.headers)
      .pipe(
        map(
          (actividadEconomica: { ok: boolean; actividadEconomica: ActividadEconomicaModel[] }) =>
            actividadEconomica.actividadEconomica,
        ),
      );
  }

  getActividadEconomicaPorId(id: number) {
    return this.httpClient
      .get(`${base_url}/actividadeconomica/${id}`, this.headers)
      .pipe(
        map(
          (actividadEconomica: { ok: boolean; actividadEconomica: ActividadEconomicaModel }) =>
            actividadEconomica.actividadEconomica,
        ),
      );
  }

  crearActividadEconomica(actividadEconomica: ActividadEconomicaModel) {
    return this.httpClient.post(`${base_url}/actividadeconomica`, actividadEconomica, this.headers);
  }

  actualizarActividadEconomica(actividadEconomica: ActividadEconomicaModel) {
    return this.httpClient.put(
      `${base_url}/actividadeconomica/${actividadEconomica.id}`,
      actividadEconomica,
      this.headers,
    );
  }

  eliminarActividadEconomica(actividadEconomica: ActividadEconomicaModel) {
    return this.httpClient.delete(`${base_url}/actividadeconomica/${actividadEconomica.id}`, this.headers);
  }
}
