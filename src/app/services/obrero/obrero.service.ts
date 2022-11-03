import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { ObreroModel } from 'src/app/core/models/obrero.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ObreroService {
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

  getObreros() {
    return this.httpClient
      .get(`${base_url}/obrero`, this.headers)
      .pipe(map((respuesta: { ok: boolean; obreros: ObreroModel[] }) => respuesta.obreros));
  }
}
