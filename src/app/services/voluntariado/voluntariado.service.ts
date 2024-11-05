import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { Observable } from 'rxjs';

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

  getVoluntariados(): Observable<VoluntariadoModel[]> {
    return this.httpClient
      .get<{ ok: boolean; voluntariados: VoluntariadoModel[] }>(`${base_url}/voluntariado`, this.headers)
      .pipe(map((respuesta) => respuesta.voluntariados));
  }

  getUnVoluntariado(id: number): Observable<VoluntariadoModel> {
    return this.httpClient
      .get<{ ok: boolean; voluntariado: VoluntariadoModel }>(`${base_url}/voluntariado/${id}`, this.headers)
      .pipe(map((respuesta) => respuesta.voluntariado));
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
