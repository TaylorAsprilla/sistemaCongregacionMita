import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AlertasDashboard,
  ConsultaUnidades,
  DetalleUnidad,
  FiltrosDashboard,
  FiltrosDisponibles,
  ResumenDashboard,
  TendenciasDashboard,
  TipoUnidad,
  UnidadesDashboard,
} from 'src/app/core/interfaces/dashboard-supervision.interface';

const base_url = `${environment.base_url}/dashboard-supervision`;

@Injectable({
  providedIn: 'root',
})
export class DashboardSupervisionService {
  private httpClient = inject(HttpClient);

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private opciones(parametros: Record<string, unknown> = {}) {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(parametros)) {
      if (valor !== null && valor !== undefined && valor !== '') {
        params = params.set(clave, String(valor));
      }
    }
    return { headers: { 'x-token': this.token }, params };
  }

  private parametrosFiltros(filtros: FiltrosDashboard): Record<string, unknown> {
    return {
      anio: filtros.anio,
      trimestre: filtros.trimestre,
      pais_id: filtros.pais_id,
      congregacion_id: filtros.congregacion_id,
      campo_id: filtros.campo_id,
      comparacion: filtros.comparacion,
    };
  }

  getFiltros(): Observable<FiltrosDisponibles> {
    return this.httpClient
      .get<{ ok: boolean; filtros: FiltrosDisponibles }>(`${base_url}/filtros`, this.opciones())
      .pipe(map((r) => r.filtros));
  }

  getResumen(filtros: FiltrosDashboard): Observable<ResumenDashboard> {
    return this.httpClient
      .get<{ ok: boolean; resumen: ResumenDashboard }>(
        `${base_url}/resumen`,
        this.opciones(this.parametrosFiltros(filtros)),
      )
      .pipe(map((r) => r.resumen));
  }

  getTendencias(filtros: FiltrosDashboard): Observable<TendenciasDashboard> {
    return this.httpClient
      .get<{ ok: boolean; tendencias: TendenciasDashboard }>(
        `${base_url}/tendencias`,
        this.opciones(this.parametrosFiltros(filtros)),
      )
      .pipe(map((r) => r.tendencias));
  }

  getAlertas(filtros: FiltrosDashboard, tipo?: string, nivel?: string): Observable<AlertasDashboard> {
    return this.httpClient
      .get<{ ok: boolean; alertas: AlertasDashboard }>(
        `${base_url}/alertas`,
        this.opciones({ ...this.parametrosFiltros(filtros), tipo, nivel }),
      )
      .pipe(map((r) => r.alertas));
  }

  getUnidades(filtros: FiltrosDashboard, consulta: ConsultaUnidades = {}): Observable<UnidadesDashboard> {
    return this.httpClient
      .get<{ ok: boolean; unidades: UnidadesDashboard }>(
        `${base_url}/unidades`,
        this.opciones({ ...this.parametrosFiltros(filtros), ...consulta }),
      )
      .pipe(map((r) => r.unidades));
  }

  getDetalleUnidad(filtros: FiltrosDashboard, tipo: TipoUnidad, id: number): Observable<DetalleUnidad> {
    return this.httpClient
      .get<{ ok: boolean; detalle: DetalleUnidad }>(
        `${base_url}/unidades/${tipo}/${id}`,
        this.opciones({
          anio: filtros.anio,
          trimestre: filtros.trimestre,
          comparacion: filtros.comparacion,
        }),
      )
      .pipe(map((r) => r.detalle));
  }
}
