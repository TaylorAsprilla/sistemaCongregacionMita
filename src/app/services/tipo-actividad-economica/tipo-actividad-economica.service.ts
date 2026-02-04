import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { TipoActividadEconomicaModel } from 'src/app/core/models/tipo-actividad-economica.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoActividadEconomicaService {
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

  getTipoActividadEconomica() {
    return this.httpClient
      .get(`${base_url}/tipoactividadeconomica/`, this.headers)
      .pipe(
        map(
          (tipoActividadEconomica: { ok: boolean; tipoActividadEconomica: TipoActividadEconomicaModel[] }) =>
            tipoActividadEconomica.tipoActividadEconomica,
        ),
      );
  }

  crearTipoActividadEconomica(tipoActividadEconomica: TipoActividadEconomicaModel) {
    return this.httpClient.post(`${base_url}/tipoactividadeconomica`, tipoActividadEconomica, this.headers);
  }

  actualizarTipoActividadEconomica(tipoActividadEconomica: TipoActividadEconomicaModel) {
    return this.httpClient.put(
      `${base_url}/tipoactividadeconomica/${tipoActividadEconomica.id}`,
      tipoActividadEconomica,
      this.headers,
    );
  }

  eliminarTipoActividadEconomica(tipoActividadEconomica: TipoActividadEconomicaModel) {
    return this.httpClient.delete(`${base_url}/tipoactividadeconomica/${tipoActividadEconomica.id}`, this.headers);
  }
}
