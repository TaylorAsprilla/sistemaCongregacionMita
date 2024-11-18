import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { usuariosSupervisorModel } from 'src/app/core/models/usuarios-supervisor.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class SupervisorCongregacionService {
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

  getUsuariosSupervisor(idSupervisor: number) {
    return this.httpClient
      .get(`${base_url}/supervisorcongregacion/${idSupervisor}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; feligres: usuariosSupervisorModel[] }) => respuesta.feligres));
  }
}
