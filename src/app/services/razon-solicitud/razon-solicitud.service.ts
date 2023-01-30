import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class RazonSolicitudService {
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

  getRazonsolicitud() {
    return this.httpClient
      .get(`${base_url}/razonsolicitud`, this.headers)
      .pipe(map((respuesta: { ok: boolean; razonSolicitud: RazonSolicitudModel[] }) => respuesta.razonSolicitud));
  }

  //pregunta
  getUnaRazonsolicitud(id: number) {
    return this.httpClient
      .get(`${base_url}/razonsolicitud/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; razonSolicitud: RazonSolicitudModel }) => respuesta.razonSolicitud));
  }

  // crearRazonSolicitud(razonSolicitud: RazonSolicitudModel) {
  //   return this.httpClient.post(`${base_url}/razonsolicitud`, razonSolicitud, this.headers);
  // }

  //pregunta
  crearRazonSolicitud(razonSolicitud: string) {
    return this.httpClient.post(
      `${base_url}/razonsolicitud`,
      { solicitud: razonSolicitud, estado: true },
      this.headers
    );
  }

  actualizarRazonSolicitud(razonSolicitud: RazonSolicitudModel) {
    return this.httpClient.put(`${base_url}/razonsolicitud/${razonSolicitud.id}`, razonSolicitud, this.headers);
  }

  elimiminarRazonsolicitud(razonSolicitud: RazonSolicitudModel) {
    return this.httpClient.delete(`${base_url}/razonsolicitud/${razonSolicitud.id}`, this.headers);
  }

  activarRazonSolicitud(razonSolicitud: RazonSolicitudModel) {
    return this.httpClient.put(`${base_url}/razonsolicitud/activar/${razonSolicitud.id}`, razonSolicitud, this.headers);
  }
}
