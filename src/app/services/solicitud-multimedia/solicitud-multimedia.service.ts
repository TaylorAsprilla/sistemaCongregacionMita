import { UsuarioSolicitudMultimediaModel } from './../../core/models/usuario-solicitud.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioSolicitudInterface } from 'src/app/core/interfaces/solicitud-multimedia';
import {
  SolicitudMultimediaInterface,
  crearSolicitudMultimediaInterface,
  denegarSolicitudMultimediaInterface,
} from 'src/app/core/models/solicitud-multimedia.model';

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
          (respuesta: { ok: boolean; solicitudDeAccesos: UsuarioSolicitudMultimediaModel[] }) =>
            respuesta.solicitudDeAccesos
        )
      );
  }

  getSolicitud(id: number) {
    return this.httpClient
      .get(`${base_url}/solicitudmultimedia/${id}`, this.headers)
      .pipe(
        map(
          (respuesta: { ok: boolean; solicitudDeAcceso: UsuarioSolicitudMultimediaModel; id: number }) =>
            respuesta.solicitudDeAcceso
        )
      );
  }

  getSolicitudesPendientes(usuarioId: number): Observable<UsuarioSolicitudMultimediaModel[]> {
    const params = new HttpParams().set('usuario_id', usuarioId?.toString() || '');
    return this.httpClient
      .get<{ ok: boolean; usuarios: UsuarioSolicitudMultimediaModel[] }>(`${base_url}/solicitudmultimedia/pendientes`, {
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

  denegarSolicitudMultimedia(denegarSolicitud: denegarSolicitudMultimediaInterface) {
    return this.httpClient.post(`${base_url}/solicitudmultimedia/denegarSolicitud/`, denegarSolicitud, this.headers);
  }

  actualizarSolicitudMultimedia(solicitudDeacceso: SolicitudMultimediaInterface, id: number) {
    return this.httpClient.put(`${base_url}/solicitudmultimedia/${id}`, solicitudDeacceso, this.headers);
  }

  activarSolicitudMultimedia(solicitudDeacceso: UsuarioSolicitudMultimediaModel) {
    return this.httpClient.put(
      `${base_url}/solicitudmultimedia/activar/${solicitudDeacceso.id}`,
      solicitudDeacceso,
      this.headers
    );
  }
}
