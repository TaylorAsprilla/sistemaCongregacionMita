import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { FuenteIngresoModel } from 'src/app/core/models/fuente-ingreso.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class FuenteIngresoService {
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

  getFuenteDeIngresos() {
    return this.httpClient
      .get(`${base_url}/fuenteingreso`, this.headers)
      .pipe(map((respuesta: { ok: boolean; fuenteDeIngreso: FuenteIngresoModel[] }) => respuesta.fuenteDeIngreso));
  }

  getUnFuenteDeIngresos(id: number) {
    return this.httpClient
      .get(`${base_url}/fuenteingreso/${id}`, this.headers)
      .pipe(map((respuesta: { ok: boolean; fuenteDeIngreso: FuenteIngresoModel }) => respuesta.fuenteDeIngreso));
  }

  crearFuenteDeIngreso(fuenteDeIngreso: FuenteIngresoModel) {
    return this.httpClient.post(`${base_url}/fuenteingreso`, fuenteDeIngreso, this.headers);
  }

  actualizarFuenteDeIngreso(fuenteDeIngreso: FuenteIngresoModel) {
    return this.httpClient.put(`${base_url}/fuenteingreso/${fuenteDeIngreso.id}`, fuenteDeIngreso, this.headers);
  }

  eliminarFuenteDeIngreso(fuenteDeIngreso: FuenteIngresoModel) {
    return this.httpClient.delete(`${base_url}/fuenteingreso/${fuenteDeIngreso.id}`, this.headers);
  }

  activarFuenteDeIngreso(fuenteDeIngreso: FuenteIngresoModel) {
    return this.httpClient.put(
      `${base_url}/fuenteingreso/activar/${fuenteDeIngreso.id}`,
      fuenteDeIngreso,
      this.headers
    );
  }
}
