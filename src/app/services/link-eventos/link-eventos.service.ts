import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { LinkEventoModel } from 'src/app/core/models/link-evento.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class LinkEventosService {
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

  getLinkEventos() {
    return this.httpClient
      .get(`${base_url}/evento`, this.headers)
      .pipe(map((links: { ok: boolean; linkEvento: LinkEventoModel[] }) => links.linkEvento));
  }

  crearEvento(evento: LinkEventoModel) {
    return this.httpClient.post(`${base_url}/evento`, evento, this.headers);
  }
}
