import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { RegistroAuditoriaInforme } from 'src/app/core/interfaces/auditoria-informe.interface';
import { InformeModel } from 'src/app/core/models/informe.model';
import {
  VerificarInformeAbiertoResponseInterface,
  InformeTrimestrePaisResponse,
  ResumenInformeResponseInterface,
  EstadoListaInformesPais,
  MisResponsabilidadesInformeResponse,
} from 'src/app/core/interfaces/informe.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class InformeService {
  private httpClient = inject(HttpClient);

  private informeActivoActual: any = null;
  private seleccionVersion = 0;
  get informeActivo(): any {
    if (!this.informeActivoActual) {
      try {
        const guardado = JSON.parse(sessionStorage.getItem('informeActivoContexto') || 'null');
        if (guardado?.id === this.informeActivoId) this.informeActivoActual = guardado;
      } catch {
        sessionStorage.removeItem('informeActivoContexto');
      }
    }
    return this.informeActivoActual;
  }
  set informeActivo(informe: any) {
    this.seleccionVersion++;
    this.informeActivoActual = informe;
    if (informe?.id) {
      sessionStorage.setItem('informeActivoId', String(informe.id));
      sessionStorage.setItem('informeActivoContexto', JSON.stringify(informe));
    } else {
      sessionStorage.removeItem('informeActivoId');
      sessionStorage.removeItem('informeActivoContexto');
    }
  }
  estadoListaPais: EstadoListaInformesPais | null = null;

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
    const id = this.informeActivoActual?.id ?? Number(sessionStorage.getItem('informeActivoId'));
    return Number.isInteger(id) && id > 0 ? id : null;
  }

  /**
   * Verifica si hay un informe activo cargado
   */
  get tieneInformeActivo(): boolean {
    return this.informeActivoId !== null;
  }

  // Todos los informes
  getInformes() {
    return this.httpClient
      .get(`${base_url}/informe`, this.headers)
      .pipe(map((informe: { ok: boolean; informes: InformeModel[] }) => informe.informes));
  }

  getMisInformes() {
    return this.httpClient
      .get<{
        ok: boolean;
        informes: {
          id: number;
          estado: string;
          periodo: string | null;
          createdAt: string;
          tipo_congregacion?: 'PAIS' | 'CONGREGACION' | 'CAMPO' | null;
          nombre_unidad?: string | null;
          nombre_pais?: string | null;
          nombre_congregacion?: string | null;
          nombre_campo?: string | null;
          responsablesHistoricos?: {
            usuario_id: number | null;
            nombre_responsable: string;
            tipo_responsabilidad: string;
          }[];
        }[];
      }>(
        `${base_url}/informe/mios`,
        this.headers,
      )
      .pipe(map((respuesta) => respuesta.informes));
  }

  getMisResponsabilidades(periodo: string) {
    return this.httpClient.get<MisResponsabilidadesInformeResponse>(
      `${base_url}/informe/responsabilidades?periodo=${encodeURIComponent(periodo)}`,
      this.headers,
    );
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
    const version = this.seleccionVersion;
    return this.verificarInformeAbierto(usuarioId, fechaInicio, fechaFin).pipe(
      map((respuesta) => {
        if (version !== this.seleccionVersion) return respuesta;
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
   * Obtiene en una sola llamada si hay informe abierto y el estatus (completado/pendiente)
   * de cada sección, evitando las 7 llamadas individuales por sección
   */
  obtenerResumenInforme(
    usuarioId: number,
    fechaInicio: string,
    fechaFin: string,
    informeId?: number | null,
  ) {
    const informe = informeId ?? this.informeActivoId;
    const parametroInforme = informe ? `&informeId=${informe}` : '';
    return this.httpClient.get<ResumenInformeResponseInterface>(
      `${base_url}/informe/resumen?usuarioId=${usuarioId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}${parametroInforme}`,
      this.headers,
    );
  }

  /**
   * Igual que obtenerResumenInforme, pero además guarda el informe activo en el servicio
   */
  cargarResumenInforme(
    usuarioId: number,
    fechaInicio: string,
    fechaFin: string,
    informeId?: number | null,
  ) {
    const version = this.seleccionVersion;
    const seleccionadoId = informeId ?? this.informeActivoId;
    return this.obtenerResumenInforme(
      usuarioId,
      fechaInicio,
      fechaFin,
      informeId,
    ).pipe(
      map((respuesta) => {
        if (version === this.seleccionVersion &&
            (!seleccionadoId || this.informeActivoId === seleccionadoId)) {
          this.informeActivo = respuesta.tieneInformeAbierto && respuesta.informe
            ? { ...this.informeActivo, ...respuesta.informe }
            : null;
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

  obtenerContextoActivo() {
    const id = this.informeActivoId;
    if (!id) return of(null);
    const activo = this.informeActivo;
    if (activo?.nombre_unidad) return of(activo);
    return this.getInforme(id).pipe(map((respuesta: any) => {
      const datos = respuesta?.informacioninforme ?? respuesta;
      const informe = Array.isArray(datos) ? datos[0] : datos;
      if (this.informeActivoId === id && informe) {
        this.informeActivo = { ...activo, ...informe };
      }
      return informe;
    }));
  }

  cerrarInforme(id: number) {
    return this.httpClient.post(
      `${base_url}/informe/${id}/cerrar`,
      {},
      this.headers,
    );
  }

  getAuditoria(id: number) {
    return this.httpClient.get<{ ok: boolean; registros: RegistroAuditoriaInforme[] }>(
      `${base_url}/informe/${id}/auditoria`, this.headers,
    );
  }

  /**
   * Obtiene todos los informes de un trimestre específico para un país
   * @param trimestre Número del trimestre (1-4)
   * @param anio Año del informe
   * @param paisId ID del país
   */
  getInformesTrimestrePais(trimestre: number, anio: number, paisId: number, todosPeriodos = false) {
    return this.httpClient.get<InformeTrimestrePaisResponse>(
      `${base_url}/informe/trimestre-pais?trimestre=${trimestre}&año=${anio}&pais_id=${paisId}${todosPeriodos ? '&todos_periodos=true' : ''}`,
      this.headers,
    );
  }
}
