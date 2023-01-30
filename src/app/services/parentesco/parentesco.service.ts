import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ParentescoService {
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

  getParentesco() {
    return this.httpClient
      .get(`${base_url}/parentesco`, this.headers)
      .pipe(map((respuesta: { ok: boolean; parentesco: ParentescoModel[] }) => respuesta.parentesco));
  }

  getUnParentesco(id: number) {
    return this.httpClient
      .get(`${base_url}/parentesco/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; parentesco: ParentescoModel }) => respuesta.parentesco));
  }

  // crearParentesco(parentesco: ParentescoModel) {
  //   return this.httpClient.post(`${base_url}/parentesco`, parentesco, this.headers);
  // }

  crearParentesco(parentesco: ParentescoModel) {
    return this.httpClient.post(`${base_url}/parentesco`, { nombre: parentesco }, this.headers);
  }

  actualizarParentesco(parentesco: ParentescoModel) {
    return this.httpClient.put(`${base_url}/parentesco/${parentesco.id}`, parentesco, this.headers);
  }

  eliminarParentesco(parentesco: ParentescoModel) {
    return this.httpClient.delete(`${base_url}/parentesco/${parentesco.id}`, this.headers);
  }

  activarParentesco(parentesco: ParentescoModel) {
    return this.httpClient.put(`${base_url}/parentesco/activar/${parentesco.id}`, parentesco, this.headers);
  }
}
