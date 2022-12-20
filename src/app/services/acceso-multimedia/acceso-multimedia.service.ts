import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { tap } from 'rxjs/operators';
import { AccesoMultimediaModel, LoginUsuarioCmarLive } from 'src/app/core/models/acceso-multimedia.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AccesoMultimediaService {
  constructor(private httpClient: HttpClient, private router: Router) {}

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

  crearAccesoMultimedia(accesoMultimedia: LoginUsuarioCmarLive) {
    return this.httpClient.post(`${base_url}/accesomultimedia`, accesoMultimedia, this.headers).pipe(
      tap((resp: any) => {
        resp;
      })
    );
  }

  eliminarAccesoMultimedia(accesoMultimedia: LoginUsuarioCmarLive) {
    return this.httpClient.delete(`${base_url}/accesomultimedia/${accesoMultimedia.id}`, this.headers);
  }

  actualizarAccesoMultimedia(accesoMultimedia: LoginUsuarioCmarLive, id: number) {
    return this.httpClient.put(`${base_url}/accesomultimedia/${id}`, accesoMultimedia, this.headers);
  }

  activarUsuario(accesoMultimedia: LoginUsuarioCmarLive) {
    return this.httpClient.put(
      `${base_url}/accesomultimedia/activar/${accesoMultimedia.id}`,
      accesoMultimedia,
      this.headers
    );
  }
}
