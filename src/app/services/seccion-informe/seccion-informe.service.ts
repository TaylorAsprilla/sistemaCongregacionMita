import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { SeccionInformeModel } from 'src/app/core/models/seccion-informe.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SeccionInformeService {
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

  getSeccionesInformes() {
    return this.httpClient
      .get(`${base_url}/seccioninforme`, this.headers)
      .pipe(
        map(
          (seccionInforme: { ok: boolean; seccionesInforme: SeccionInformeModel[] }) => seccionInforme.seccionesInforme
        )
      );
  }

  getSeccionInforme(id: string) {
    return this.httpClient
      .get(`${base_url}/seccioninforme/${id}`, this.headers)
      .pipe(
        map((seccionInforme: { ok: boolean; seccionesInforme: SeccionInformeModel }) => seccionInforme.seccionesInforme)
      );
  }

  crearSeccionInforme(seccionInforme: SeccionInformeModel) {
    return this.httpClient.post(`${base_url}/seccioninforme`, seccionInforme, this.headers);
  }

  actualizarSeccionInforme(seccionInforme: SeccionInformeModel) {
    return this.httpClient.put(`${base_url}/seccioninforme/${seccionInforme.id}`, seccionInforme, this.headers);
  }

  elimiminarSeccionInforme(seccionInforme: SeccionInformeModel) {
    return this.httpClient.delete(`${base_url}/seccioninforme/${seccionInforme.id}`, this.headers);
  }
}
