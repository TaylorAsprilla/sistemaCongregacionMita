import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { AccesoMultimediaModel } from 'src/app/models/acceso-multimedia.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AccesoMultimediaService {
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

  getAccesosMultimedia() {
    return this.httpClient
      .get(`${base_url}/accesomultimedia`, this.headers)
      .pipe(
        map((respuesta: { ok: boolean; solicitudDeAccesos: AccesoMultimediaModel[] }) => respuesta.solicitudDeAccesos)
      );
  }

  getAccesoMultimedia(id: number) {
    return this.httpClient
      .get(`${base_url}/accesomultimedia/${id}`, this.headers)
      .pipe(
        map(
          (respuesta: { ok: boolean; solicitudDeAcceso: AccesoMultimediaModel; id: number }) =>
            respuesta.solicitudDeAcceso
        )
      );
  }

  crearCongregacion(solicitudDeacceso: AccesoMultimediaModel) {
    return this.httpClient.post(`${base_url}/accesomultimedia`, solicitudDeacceso, this.headers);
  }
}
