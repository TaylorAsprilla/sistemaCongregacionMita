import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GeneroModel } from 'src/app/models/genero.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class GeneroService {
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

  listarGeneros() {
    return this.httpClient
      .get(`${base_url}/genero`, this.headers)
      .pipe(map((genero: { ok: boolean; genero: GeneroModel[] }) => genero.genero));
  }

  crearGenero(genero: GeneroModel) {
    return this.httpClient.post(`${base_url}/genero`, genero, this.headers);
  }

  actualizarGenero(genero: GeneroModel) {
    return this.httpClient.put(`${base_url}/genero/${genero.id}`, genero, this.headers);
  }

  elimiminarGenero(genero: GeneroModel) {
    return this.httpClient.delete(`${base_url}/genero/${genero.id}`, this.headers);
  }
}
