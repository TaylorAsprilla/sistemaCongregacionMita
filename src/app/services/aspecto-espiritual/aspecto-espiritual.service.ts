import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { AspectoEspiritualModel } from 'src/app/core/models/aspecto-espiritual.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AspectoEspiritualService {
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

  getAspectosEspiritualesByInforme(informeId: number) {
    return this.httpClient
      .get(`${base_url}/actividadespiritual/informe/${informeId}`, this.headers)
      .pipe(map((response: any) => (response.actividades || []) as AspectoEspiritualModel[]));
  }

  crearAspectoEspiritual(aspecto: Partial<AspectoEspiritualModel>) {
    return this.httpClient.post(`${base_url}/actividadespiritual`, aspecto, this.headers);
  }

  actualizarAspectoEspiritual(id: number, aspecto: Partial<AspectoEspiritualModel>) {
    return this.httpClient.put(`${base_url}/actividadespiritual/${id}`, aspecto, this.headers);
  }

  eliminarAspectoEspiritual(id: number) {
    return this.httpClient.delete(`${base_url}/actividadespiritual/${id}`, this.headers);
  }
}
