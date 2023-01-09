import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { OpcionTransporteModel } from 'src/app/core/models/opcion-transporte.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class OpcionTransporteService {
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

  getOpcionTransporte() {
    return this.httpClient
      .get(`${base_url}/opciontransporte`, this.headers)
      .pipe(map((respuesta: { ok: boolean; opcionTransporte: OpcionTransporteModel[] }) => respuesta.opcionTransporte));
  }

  getUnaOpcionTransporte(id: number) {
    return this.httpClient
      .get(`${base_url}/opciontransporte/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; opcionTransporte: OpcionTransporteModel }) => respuesta.opcionTransporte));
  }

  crearTipoEstudio(opcionTransporte: OpcionTransporteModel) {
    return this.httpClient.post(`${base_url}/opciontransporte`, opcionTransporte, this.headers);
  }

  actualizarTipoEstudio(opcionTransporte: OpcionTransporteModel) {
    return this.httpClient.put(`${base_url}/opciontransporte/${opcionTransporte.id}`, opcionTransporte, this.headers);
  }

  eliminarTipoEmpleo(opcionTransporte: OpcionTransporteModel) {
    return this.httpClient.delete(`${base_url}/opciontransporte/${opcionTransporte.id}`, this.headers);
  }

  activarTipoEmpleo(opcionTransporte: OpcionTransporteModel) {
    return this.httpClient.put(
      `${base_url}/opciontransporte/activar/${opcionTransporte.id}`,
      opcionTransporte,
      this.headers
    );
  }
}
