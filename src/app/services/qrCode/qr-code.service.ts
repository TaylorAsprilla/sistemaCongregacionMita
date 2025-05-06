import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Observable } from 'rxjs';
import { AccesosQrResponseInterface } from 'src/app/core/interfaces/acceso-qr.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
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

  getQRCode(idCongregacion: number, descripcion: string): Observable<any> {
    return this.httpClient.post<any>(`${base_url}/accesoqr/generarQr`, { idCongregacion, descripcion }, this.headers);
  }

  getUltimoQrGenerado(): Observable<any> {
    return this.httpClient.get<any>(`${base_url}/accesoqr/ultimoQr`, this.headers);
  }

  obtenerListadoAccesos(): Observable<any> {
    return this.httpClient.get<AccesosQrResponseInterface>(`${base_url}/accesoqr/listadoAccesos`, this.headers);
  }
}
