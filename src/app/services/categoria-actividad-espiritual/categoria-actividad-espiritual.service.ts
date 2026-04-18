import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { CategoriaActividadEspiritualModel } from 'src/app/core/models/categoria-actividad-espiritual.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class CategoriaActividadEspiritualService {
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

  getCategorias() {
    return this.httpClient
      .get(`${base_url}/categoriaactividadespiritual`, this.headers)
      .pipe(
        map((response: any) => (response.categorias || response.data || []) as CategoriaActividadEspiritualModel[]),
      );
  }

  crearCategoria(categoria: Partial<CategoriaActividadEspiritualModel>) {
    return this.httpClient.post(`${base_url}/categoriaactividadespiritual`, categoria, this.headers);
  }

  actualizarCategoria(id: number, categoria: Partial<CategoriaActividadEspiritualModel>) {
    return this.httpClient.put(`${base_url}/categoriaactividadespiritual/${id}`, categoria, this.headers);
  }

  eliminarCategoria(id: number) {
    return this.httpClient.delete(`${base_url}/categoriaactividadespiritual/${id}`, this.headers);
  }
}
