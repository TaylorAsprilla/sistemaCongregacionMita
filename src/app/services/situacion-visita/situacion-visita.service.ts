import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SituacionVisitaService {
  private http = inject(HttpClient);

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

  getSituacionVisitas(): Observable<SituacionVisitaModel[]> {
    const url = `${base_url}/situacionvisita`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp) => {
        return resp.situacionVisitas || [];
      }),
    );
  }

  getSituacionVisita(id: number): Observable<SituacionVisitaModel> {
    const url = `${base_url}/situacionvisita/${id}`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp) => {
        return resp.situacionVisita;
      }),
    );
  }

  crearSituacionVisita(formData: any): Observable<any> {
    const url = `${base_url}/situacionvisita`;
    return this.http.post(url, formData, this.headers);
  }

  actualizarSituacionVisita(id: number, formData: any): Observable<any> {
    const url = `${base_url}/situacionvisita/${id}`;
    return this.http.put(url, formData, this.headers);
  }

  eliminarSituacionVisita(id: number): Observable<any> {
    const url = `${base_url}/situacionvisita/${id}`;
    return this.http.delete(url, this.headers);
  }
}
