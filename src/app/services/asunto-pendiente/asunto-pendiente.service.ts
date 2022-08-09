import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { AsuntoPendienteModel } from 'src/app/models/asunto-pendiente.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AsuntoPendienteService {
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

  getAsuntoPendiente() {
    return this.httpClient
      .get(`${base_url}/asuntopendiente`, this.headers)
      .pipe(
        map(
          (asuntoPendiente: { ok: boolean; asuntosPendientes: AsuntoPendienteModel[] }) =>
            asuntoPendiente.asuntosPendientes
        )
      );
  }

  crearasuntoPendiente(asuntoPendiente: AsuntoPendienteModel) {
    return this.httpClient.post(`${base_url}/asuntopendiente`, asuntoPendiente, this.headers);
  }

  actualizarAsuntoPendiente(asuntoPendiente: AsuntoPendienteModel) {
    return this.httpClient.put(`${base_url}/asuntopendiente/${asuntoPendiente.id}`, asuntoPendiente, this.headers);
  }
}
