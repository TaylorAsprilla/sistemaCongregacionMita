import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { LinkEventoModel } from 'src/app/core/models/link-evento.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class LinkEventosService {
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

  getEventos() {
    return this.httpClient
      .get(`${base_url}/evento`, this.headers)
      .pipe(map((respuesta: { ok: boolean; linkEvento: LinkEventoModel[] }) => respuesta.linkEvento));
  }

  getUnLinkEvento(id: number) {
    return this.httpClient
      .get(`${base_url}/evento/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; linkEvento: LinkEventoModel }) => respuesta.linkEvento));
  }

  getLinkServicio() {
    return this.httpClient
      .get(`${base_url}/evento/link/servicio`, this.headers)
      .pipe(map((respuesta: { ok: boolean; linkEvento: LinkEventoModel }) => respuesta.linkEvento));
  }

  crearEvento(evento: LinkEventoModel) {
    return this.httpClient.post(`${base_url}/evento`, evento, this.headers);
  }

  actualizarEvento(evento: LinkEventoModel) {
    return this.httpClient.put(`${base_url}/evento/${evento.id}`, evento, this.headers);
  }

  eliminarEvento(evento: LinkEventoModel) {
    return this.httpClient.delete(`${base_url}/evento/${evento.id}`, this.headers);
  }

  activarEvento(evento: LinkEventoModel) {
    return this.httpClient.put(`${base_url}/evento/activar/${evento.id}`, evento, this.headers);
  }

  agregarABiblioteca(evento: LinkEventoModel) {
    return this.httpClient.put(`${base_url}/evento/agregarbiblioteca/${evento.id}`, evento, this.headers);
  }

  eliminarDeLaBiblioteca(evento: LinkEventoModel) {
    return this.httpClient.put(`${base_url}/evento/eliminardebiblioteca/${evento.id}`, evento, this.headers);
  }
}
