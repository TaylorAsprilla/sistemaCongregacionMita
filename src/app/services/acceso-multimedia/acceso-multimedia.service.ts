import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { tap } from 'rxjs/operators';
import { AccesoCongregacionMultimedia, LoginUsuarioCmarLiveInterface } from 'src/app/core/interfaces/acceso-multimedia';
import { AccesoMultimediaModel } from 'src/app/core/models/acceso-multimedia.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AccesoMultimediaService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

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

  crearAccesoMultimedia(accesoMultimedia: LoginUsuarioCmarLiveInterface) {
    return this.httpClient.post(`${base_url}/accesomultimedia`, accesoMultimedia, this.headers).pipe(
      tap((resp: any) => {
        resp;
      })
    );
  }

  crearAccesoCongregacionMultimedia(accesoCongregacionMultimedia: AccesoCongregacionMultimedia) {
    return this.httpClient
      .post(`${base_url}/accesomultimedia/congregacion`, accesoCongregacionMultimedia, this.headers)
      .pipe(
        tap((resp: any) => {
          resp;
        })
      );
  }

  eliminarAccesoMultimedia(idAccesoMultimedia: number) {
    return this.httpClient.delete(`${base_url}/accesomultimedia/${idAccesoMultimedia}`, this.headers);
  }

  actualizarAccesoMultimedia(accesoMultimedia: LoginUsuarioCmarLiveInterface, id: number) {
    return this.httpClient.put(`${base_url}/accesomultimedia/${id}`, accesoMultimedia, this.headers);
  }

  activarAccesoMultimedia(accesoMultimedia: AccesoMultimediaModel) {
    return this.httpClient.put(
      `${base_url}/accesomultimedia/activar/${accesoMultimedia.id}`,
      accesoMultimedia,
      this.headers
    );
  }
}
