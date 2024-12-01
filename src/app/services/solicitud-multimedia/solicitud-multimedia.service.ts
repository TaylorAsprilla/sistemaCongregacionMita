import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioSolicitudInterface } from 'src/app/core/interfaces/solicitud-multimedia';
import {
  SolicitudMultimediaInterface,
  SolicitudMultimediaModel,
  crearSolicitudMultimediaInterface,
} from 'src/app/core/models/solicitud-multimedia.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SolicitudMultimediaService {
  public solicitudMultimedia: SolicitudMultimediaModel[] = [];

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
          (respuesta: { ok: boolean; solicitudDeAccesos: SolicitudMultimediaInterface[] }) =>
            respuesta.solicitudDeAccesos
        )
      );
  }

  getSolicitud(id: number) {
    return this.httpClient
      .get(`${base_url}/solicitudmultimedia/${id}`, this.headers)
      .pipe(
        map(
          (respuesta: { ok: boolean; solicitudDeAcceso: SolicitudMultimediaInterface; id: number }) =>
            respuesta.solicitudDeAcceso
        )
      );
  }

  getSolicitudesPendientes(usuarioId: number): Observable<UsuarioSolicitudInterface[]> {
    const params = new HttpParams().set('usuario_id', usuarioId?.toString() || '');
    return this.httpClient
      .get<{ ok: boolean; usuarios: UsuarioSolicitudInterface[] }>(`${base_url}/solicitudmultimedia/pendientes`, {
        ...this.headers,
        params,
      })
      .pipe(map((response) => response.usuarios));
  }

  crearSolicitudMultimedia(solicitudDeacceso: crearSolicitudMultimediaInterface) {
    return this.httpClient.post(`${base_url}/solicitudmultimedia`, solicitudDeacceso, this.headers);
  }

  validarEmail(id: number) {
    return this.httpClient.put(`${base_url}/solicitudmultimedia/validaremail/${id}`, null);
  }

  eliminarSolicitudMultimedia(idsolicitudDeacceso: number) {
    return this.httpClient.delete(`${base_url}/solicitudmultimedia/${idsolicitudDeacceso}`, this.headers);
  }

  actualizarSolicitudMultimedia(solicitudDeacceso: SolicitudMultimediaInterface, id: number) {
    return this.httpClient.put(`${base_url}/solicitudmultimedia/${id}`, solicitudDeacceso, this.headers);
  }

  activarSolicitudMultimedia(solicitudDeacceso: SolicitudMultimediaModel) {
    return this.httpClient.put(
      `${base_url}/solicitudmultimedia/activar/${solicitudDeacceso.id}`,
      solicitudDeacceso,
      this.headers
    );
  }
}
