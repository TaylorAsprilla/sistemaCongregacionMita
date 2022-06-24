import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { VacunaModel } from 'src/app/models/vacuna.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class VacunaService {
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

  listarVacuna() {
    return this.httpClient
      .get(`${base_url}/vacuna`, this.headers)
      .pipe(map((vacuna: { ok: boolean; vacuna: VacunaModel[] }) => vacuna.vacuna));
  }

  crearVacuna(vacuna: VacunaModel) {
    return this.httpClient.post(`${base_url}/vacuna`, vacuna, this.headers);
  }

  actualizarVacuna(vacuna: VacunaModel) {
    return this.httpClient.put(`${base_url}/vacuna/${vacuna.id}`, vacuna, this.headers);
  }
}
