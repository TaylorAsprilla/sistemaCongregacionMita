import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { AsuntoPendienteModel } from 'src/app/core/models/asunto-pendiente.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AsuntoPendienteService {
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

  getAsuntosPendientes() {
    return this.httpClient
      .get(`${base_url}/asunto-pendiente/`, this.headers)
      .pipe(map((response: any) => (response.asuntosPendientes || []) as AsuntoPendienteModel[]));
  }

  crearAsuntoPendiente(asunto: AsuntoPendienteModel) {
    return this.httpClient.post(`${base_url}/asunto-pendiente`, asunto, this.headers);
  }

  actualizarAsuntoPendiente(asunto: AsuntoPendienteModel) {
    return this.httpClient.put(`${base_url}/asunto-pendiente/${asunto.id}`, asunto, this.headers);
  }

  eliminarAsuntoPendiente(id: number) {
    return this.httpClient.delete(`${base_url}/asunto-pendiente/${id}`, this.headers);
  }
}
