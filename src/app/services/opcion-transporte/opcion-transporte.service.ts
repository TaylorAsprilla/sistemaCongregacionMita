import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { OpcionTransporteModel } from 'src/app/core/models/opcion-transporte.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class OpcionTransporteService {
  constructor(private httpClient: HttpClient) {}

  private get token(): string {
    return localStorage.getItem('token') || '';
  }

  private get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  // Obtener todas las opciones de transporte
  getOpcionTransporte(): Observable<OpcionTransporteModel[]> {
    return this.httpClient
      .get<{ ok: boolean; opcionTransporte: OpcionTransporteModel[] }>(`${base_url}/opciontransporte`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.opcionTransporte : [])),
        catchError(this.handleError)
      );
  }

  // Obtener una opción de transporte por ID
  getUnaOpcionTransporte(id: number): Observable<OpcionTransporteModel | null> {
    return this.httpClient
      .get<{ ok: boolean; opcionTransporte: OpcionTransporteModel }>(`${base_url}/opciontransporte/${id}`, this.headers)
      .pipe(
        map((response) => (response.ok ? response.opcionTransporte : null)),
        catchError(this.handleError)
      );
  }

  // Crear una nueva opción de transporte
  crearOpcionTransporte(opcionTransporte: string): Observable<OpcionTransporteModel> {
    return this.httpClient
      .post<OpcionTransporteModel>(`${base_url}/opciontransporte`, { tipoTransporte: opcionTransporte }, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Actualizar una opción de transporte
  actualizarOpcionTransporte(opcionTransporte: OpcionTransporteModel): Observable<OpcionTransporteModel> {
    return this.httpClient
      .put<OpcionTransporteModel>(`${base_url}/opciontransporte/${opcionTransporte.id}`, opcionTransporte, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Eliminar una opción de transporte
  eliminarOpcionTransporte(opcionTransporte: OpcionTransporteModel): Observable<void> {
    return this.httpClient
      .delete<void>(`${base_url}/opciontransporte/${opcionTransporte.id}`, this.headers)
      .pipe(catchError(this.handleError));
  }

  // Activar una opción de transporte
  activarOpcionTransporte(opcionTransporte: OpcionTransporteModel): Observable<OpcionTransporteModel> {
    return this.httpClient
      .put<OpcionTransporteModel>(
        `${base_url}/opciontransporte/activar/${opcionTransporte.id}`,
        opcionTransporte,
        this.headers
      )
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo más tarde.'));
  }
}
