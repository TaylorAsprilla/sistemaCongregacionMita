import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class GemelosService {
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

  getGruposGemelos(): Observable<any> {
    return this.httpClient.get<any>(`${base_url}/grupogemelos`, this.headers);
  }

  enviarGrupoGemelos(data: any): Observable<any> {
    return this.httpClient.post(`${base_url}/grupogemelos/crear-grupo-usuarios`, data, this.headers);
  }
}
