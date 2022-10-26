import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
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

  listarTipoDocumentos() {
    return this.httpClient
      .get(`${base_url}/tipodocumento`, this.headers)
      .pipe(map((tipoDocumento: { ok: boolean; tipoDocumento: TipoDocumentoModel[] }) => tipoDocumento.tipoDocumento));
  }

  getTipoDocumento(id: string) {
    return this.httpClient
      .get(`${base_url}/tipodocumento/${id}`, this.headers)
      .pipe(map((tipodocumento: { ok: boolean; tipodocumento: TipoDocumentoModel }) => tipodocumento.tipodocumento));
  }

  crearTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.httpClient.post(`${base_url}/tipodocumento`, tipoDocumento, this.headers);
  }

  actualizarTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.httpClient.put(`${base_url}/tipodocumento/${tipoDocumento.id}`, tipoDocumento, this.headers);
  }

  elimiminarTipoDocumento(tipoDocumento: TipoDocumentoModel) {
    return this.httpClient.delete(`${base_url}/tipodocumento/${tipoDocumento.id}`, this.headers);
  }
}
