import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class GradoAcademicoService {
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

  getGradosAcademicos() {
    return this.httpClient
      .get(`${base_url}/gradoacademico`, this.headers)
      .pipe(map((respuesta: { ok: boolean; gradoAcademico: GradoAcademicoModel[] }) => respuesta.gradoAcademico));
  }

  getUnGradoAcademico(id: number) {
    return this.httpClient
      .get(`${base_url}/gradoacademico/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; gradoAcademico: GradoAcademicoModel }) => respuesta.gradoAcademico));
  }

  crearGradoAcademico(gradoAcademico: string) {
    return this.httpClient.post(`${base_url}/gradoAcademico`, { gradoAcademico: gradoAcademico }, this.headers);
  }

  actualizarGradoAcademico(gradoAcademico: GradoAcademicoModel) {
    return this.httpClient.put(`${base_url}/gradoAcademico/${gradoAcademico.id}`, gradoAcademico, this.headers);
  }

  eliminarGradoAcademico(gradoAcademico: GradoAcademicoModel) {
    return this.httpClient.delete(`${base_url}/gradoacademico/${gradoAcademico.id}`, this.headers);
  }

  activarGradoAcademico(gradoAcademico: GradoAcademicoModel) {
    return this.httpClient.put(`${base_url}/gradoAcademico/activar/${gradoAcademico.id}`, gradoAcademico, this.headers);
  }
}
