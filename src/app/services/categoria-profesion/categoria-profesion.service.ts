import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { CategoriaProfesionModel } from 'src/app/core/models/categoria-profesion.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CategoriaProfesionService {
  private httpClient = inject(HttpClient);

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

  getCategoriasProfesion() {
    return this.httpClient
      .get(`${base_url}/categorias-profesion`, this.headers)
      .pipe(
        map((response: { ok: boolean; categorias: CategoriaProfesionModel[] }) => response.categorias)
      );
  }

  getUnaCategoriaProfesion(id: number) {
    return this.httpClient
      .get(`${base_url}/categorias-profesion/${id}`, this.headers)
      .pipe(
        map((response: { ok: boolean; categoria: CategoriaProfesionModel }) => response.categoria)
      );
  }

  crearCategoriaProfesion(data: { nombre: string; descripcion: string }) {
    return this.httpClient.post(`${base_url}/categorias-profesion`, data, this.headers);
  }

  actualizarCategoriaProfesion(categoria: CategoriaProfesionModel) {
    return this.httpClient.put(`${base_url}/categorias-profesion/${categoria.id}`, categoria, this.headers);
  }

  eliminarCategoriaProfesion(categoria: CategoriaProfesionModel) {
    return this.httpClient.delete(`${base_url}/categorias-profesion/${categoria.id}`, this.headers);
  }

  activarCategoriaProfesion(categoria: CategoriaProfesionModel) {
    return this.httpClient.put(`${base_url}/categorias-profesion/activar/${categoria.id}`, categoria, this.headers);
  }
}
