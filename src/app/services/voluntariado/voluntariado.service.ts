import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class VoluntariadoService {
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

  getVoluntariados() {
    return this.httpClient
      .get(`${base_url}/voluntariado`, this.headers)
      .pipe(map((respuesta: { ok: boolean; voluntariados: VoluntariadoModel[] }) => respuesta.voluntariados));
  }

  getUnVoluntariado(id: number) {
    return this.httpClient
      .get(`${base_url}/voluntariado/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; voluntariado: VoluntariadoModel }) => respuesta.voluntariado));
  }

  crearVoluntariado(voluntariado: string) {
    return this.httpClient.post(`${base_url}/voluntariado`, { nombreVoluntariado: voluntariado }, this.headers);
  }

  actualizarVoluntariado(voluntariado: VoluntariadoModel) {
    return this.httpClient.put(`${base_url}/voluntariado/${voluntariado.id}`, voluntariado, this.headers);
  }

  eliminarVoluntariado(voluntariado: VoluntariadoModel) {
    return this.httpClient.delete(`${base_url}/voluntariado/${voluntariado.id}`, this.headers);
  }

  activarVoluntariado(voluntariado: VoluntariadoModel) {
    return this.httpClient.put(`${base_url}/voluntariado/activar/${voluntariado.id}`, voluntariado, this.headers);
  }
}
