import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SeccionInformeModel } from 'src/app/models/seccion-informe.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SeccionInformeService {
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
