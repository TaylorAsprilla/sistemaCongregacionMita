import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { InformeModel } from 'src/app/core/models/informe.model';
import { VerificarInformeAbiertoResponseInterface } from 'src/app/core/interfaces/informe.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class InformeService {
  private httpClient = inject(HttpClient);

  // Informe activo del usuario
  public informeActivo: any = null;

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

  /**
   * Obtiene el ID del informe activo
   */
  get informeActivoId(): number | null {
    return this.informeActivo?.id || null;
  }

  /**
   * Verifica si hay un informe activo cargado
   */
  get tieneInformeActivo(): boolean {
    return this.informeActivo !== null;
  }

  // Todos los informes
  getInformes() {
    return this.httpClient
      .get(`${base_url}/informe`, this.headers)
      .pipe(map((informe: { ok: boolean; informes: InformeModel[] }) => informe.informes));
  }

  getInforme(id: number) {
    return this.httpClient
      .get(`${base_url}/informe/${id}`, this.headers)
      .pipe(map((informe: { ok: boolean; informe: any[] }) => informe.informe));
  }

  crearInforme(informe: InformeModel) {
    return this.httpClient.post(`${base_url}/informe`, informe, this.headers);
  }

  actualizarInforme(informe: InformeModel) {
    return this.httpClient.put(`${base_url}/informe/${informe.id}`, informe, this.headers);
  }

  verificarInformeAbierto(usuarioId: number, fechaInicio: string, fechaFin: string) {
    return this.httpClient.get<VerificarInformeAbiertoResponseInterface>(
      `${base_url}/informe/verificar-abierto?usuario_id=${usuarioId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      this.headers,
    );
  }

  /**
   * Carga el informe activo del trimestre actual y lo guarda en el servicio
   * para que esté disponible en toda la aplicación
   */
  cargarInformeActivo(usuarioId: number, fechaInicio: string, fechaFin: string) {
    return this.verificarInformeAbierto(usuarioId, fechaInicio, fechaFin).pipe(
      map((respuesta) => {
        if (respuesta.tieneInformeAbierto && respuesta.informe) {
          this.informeActivo = respuesta.informe;
        } else {
          this.informeActivo = null;
        }
        return respuesta;
      }),
    );
  }

  /**
   * Limpia el informe activo del servicio
   */
  limpiarInformeActivo() {
    this.informeActivo = null;
  }
}
