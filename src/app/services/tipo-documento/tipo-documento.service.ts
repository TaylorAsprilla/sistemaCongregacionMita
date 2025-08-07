import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

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

  getTiposDeDocumentos() {
    return this.httpClient
      .get(`${base_url}/tipodocumento`, this.headers)
      .pipe(map((tipoDocumento: { ok: boolean; tipoDocumento: TipoDocumentoModel[] }) => tipoDocumento.tipoDocumento));
  }

  getTipoDocumento(id: string) {
    return this.httpClient
      .get(`${base_url}/tipodocumento/${id}`, this.headers)
      .pipe(map((tipodocumento: { ok: boolean; tipoDocumento: TipoDocumentoModel }) => tipodocumento.tipoDocumento));
  }

  crearTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.httpClient.post(`${base_url}/tipodocumento`, tipoDocumento, this.headers);
  }

  actualizarTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.httpClient.put(`${base_url}/tipodocumento/${tipoDocumento.id}`, tipoDocumento, this.headers);
  }

  eliminarTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.httpClient.delete(`${base_url}/tipodocumento/${tipoDocumento.id}`, this.headers);
  }

  activarTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.httpClient.put(`${base_url}/tipodocumento/activar/${tipoDocumento.id}`, tipoDocumento, this.headers);
  }
}
