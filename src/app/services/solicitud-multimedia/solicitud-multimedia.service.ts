import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { SolicitudMultimediaModel } from 'src/app/core/models/acceso-multimedia.model';

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
      .get(`${base_url}/solicitud`, this.headers)
      .pipe(
        map(
          (respuesta: { ok: boolean; solicitudDeAccesos: SolicitudMultimediaModel[] }) => respuesta.solicitudDeAccesos
        )
      );
  }

  getSolicitud(id: number) {
    return this.httpClient
      .get(`${base_url}/solicitud/${id}`, this.headers)
      .pipe(
        map(
          (respuesta: { ok: boolean; solicitudDeAcceso: SolicitudMultimediaModel; id: number }) =>
            respuesta.solicitudDeAcceso
        )
      );
  }

  crearSolicitudMultimedia(solicitudDeacceso: SolicitudMultimediaModel) {
    return this.httpClient.post(`${base_url}/solicitud`, solicitudDeacceso, this.headers);
  }
}
