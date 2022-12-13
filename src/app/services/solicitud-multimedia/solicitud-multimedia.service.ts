import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { SolicitudMultimediaInterface, SolicitudMultimediaModel } from 'src/app/core/models/solicitud-multimedia';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SolicitudMultimediaService {
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

  getSolicitudes() {
    return this.httpClient
      .get(`${base_url}/solicitudmultimedia`, this.headers)
      .pipe(
        map(
          (respuesta: { ok: boolean; solicitudDeAccesos: SolicitudMultimediaModel[] }) => respuesta.solicitudDeAccesos
        )
      );
  }

  getSolicitud(id: number) {
    return this.httpClient
      .get(`${base_url}/solicitudmultimedia/${id}`, this.headers)
      .pipe(
        map(
          (respuesta: { ok: boolean; solicitudDeAcceso: SolicitudMultimediaModel; id: number }) =>
            respuesta.solicitudDeAcceso
        )
      );
  }

  crearSolicitudMultimedia(solicitudDeacceso: SolicitudMultimediaInterface) {
    return this.httpClient.post(`${base_url}/solicitudmultimedia`, solicitudDeacceso, this.headers);
  }

  validarEmail(id: number) {
    return this.httpClient.put(`${base_url}/solicitudmultimedia/validaremail/${id}`, null);
  }
}
