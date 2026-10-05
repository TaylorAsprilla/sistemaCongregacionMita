import { Injectable, inject } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable, firstValueFrom } from 'rxjs';
import {
  AlertaDashboard,
  ETIQUETAS_ESTADO_ENTREGA,
  ETIQUETAS_TIPO_ALERTA,
  FiltrosDashboard,
  ResumenDashboard,
  UnidadFila,
  Variacion,
} from 'src/app/core/interfaces/dashboard-supervision.interface';
import { DashboardSupervisionService } from './dashboard-supervision.service';

const NOTA_COMPARACION =
  'Las variaciones se calculan únicamente con las unidades que tienen informe en ambos periodos. ' +
  'Los indicadores describen la información registrada; la interpretación corresponde al administrador.';

/** Exporta el estado actual del dashboard (mismos filtros) a Excel y PDF. */
@Injectable({
  providedIn: 'root',
})
export class DashboardSupervisionExportService {
  private servicio = inject(DashboardSupervisionService);

  private async obtenerDatos(filtros: FiltrosDashboard, conUnidades = true) {
    const [resumen, alertas, unidades] = await Promise.all([
      firstValueFrom(this.servicio.getResumen(filtros)),
      firstValueFrom(this.servicio.getAlertas(filtros)),
      conUnidades ? this.obtenerTodasLasUnidades(filtros) : Promise.resolve([] as UnidadFila[]),
    ]);
    return { resumen, alertas: alertas.alertas, unidades };
  }

  private async obtenerTodasLasUnidades(filtros: FiltrosDashboard): Promise<UnidadFila[]> {
    const porPagina = 100;
    const primera = await firstValueFrom(this.servicio.getUnidades(filtros, { pagina: 1, porPagina }));
    const restantes: Observable<{ unidades: UnidadFila[] }>[] = [];
    for (let p = 2; p <= primera.totalPaginas; p++) {
      restantes.push(this.servicio.getUnidades(filtros, { pagina: p, porPagina }));
    }
    const paginas = await Promise.all(restantes.map((o) => firstValueFrom(o)));
    return [primera, ...paginas].flatMap((p) => p.unidades);
  }

  private nombreArchivo(resumen: ResumenDashboard, extension: string): string {
    const p = resumen.contexto.periodo;
    return `Supervision_Q${p.trimestre}_${p.anio}.${extension}`;
  }

  private textoVariacion(v: Variacion | undefined): string {
    if (!v) return '';
    if (v.estado !== 'VARIACION' || v.porcentaje === null) return v.mensaje;
    const signo = v.porcentaje > 0 ? '+' : '';
    return `${signo}${v.porcentaje.toLocaleString('es', { maximumFractionDigits: 1 })} %`;
  }

  // ---------------------------------------------------------------- Excel

  async exportarExcel(filtros: FiltrosDashboard, alcance: string): Promise<void> {
    const { resumen, alertas, unidades } = await this.obtenerDatos(filtros);
    const libro = new Workbook();
    libro.creator = 'Sistema CMI';
    libro.created = new Date();

    this.hojaResumen(libro.addWorksheet('Resumen'), resumen, alcance);
    this.hojaAsistencia(libro.addWorksheet('Asistencia por servicio'), resumen);
    this.hojaUnidades(libro.addWorksheet('Unidades'), unidades);
    this.hojaAlertas(libro.addWorksheet('Alertas'), alertas);

    const buffer = await libro.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      this.nombreArchivo(resumen, 'xlsx'),
    );
  }

  private encabezado(hoja: Worksheet, columnas: { header: string; key: string; width: number }[]): void {
    hoja.columns = columnas;
    const fila = hoja.getRow(1);
    fila.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    fila.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E66B8' } };
    fila.alignment = { vertical: 'middle', wrapText: true };
    hoja.views = [{ state: 'frozen', ySplit: 1 }];
  }

  private hojaResumen(hoja: Worksheet, r: ResumenDashboard, alcance: string): void {
    hoja.columns = [
      { key: 'a', width: 42 },
      { key: 'b', width: 18 },
      { key: 'c', width: 18 },
      { key: 'd', width: 28 },
    ];
    hoja.addRow(['Dashboard Ejecutivo de Supervisión Congregacional']).font = { bold: true, size: 14 };
    hoja.addRow(['Periodo', r.contexto.periodo.etiqueta]);
    hoja.addRow(['Comparado con el', r.contexto.descripcionComparacion]);
    hoja.addRow(['Alcance', alcance]);
    hoja.addRow(['Generado', new Date(r.contexto.generadoEn).toLocaleString('es')]);
    hoja.addRow([]);

    hoja.addRow(['Cobertura']).font = { bold: true };
    const c = r.cobertura;
    hoja.addRow(['Unidades', c.unidades]);
    hoja.addRow(['Unidades con obrero asignado', c.conObrero]);
    hoja.addRow(['Informes entregados (cerrados)', c.entregados]);
    hoja.addRow(['Informes en elaboración', c.enElaboracion]);
    hoja.addRow(['Informes pendientes', c.pendientes]);
    hoja.addRow(['Unidades sin obrero', c.sinObrero]);
    hoja.addRow(['% de unidades con informe', c.porcentajeConInforme === null ? '' : c.porcentajeConInforme / 100]).getCell(2).numFmt = '0.0%';
    hoja.addRow(['Unidades comparadas (con informe en ambos periodos)', c.unidadesComparadas]);
    hoja.addRow([]);

    const titulo = hoja.addRow(['Indicador', 'Periodo anterior', 'Periodo actual', 'Variación']);
    titulo.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E66B8' } };
    for (const i of r.indicadores) {
      hoja.addRow([i.etiqueta, i.variacion.anterior, i.valorPeriodo, this.textoVariacion(i.variacion)]);
    }
    hoja.addRow([]);
    hoja.addRow(['Actividad económica', r.actividadEconomica.disponible ? r.actividadEconomica.montoRecaudado : r.actividadEconomica.mensaje]);
    hoja.addRow([]);
    hoja.addRow([NOTA_COMPARACION]).font = { italic: true, color: { argb: 'FF6B7280' } };
  }

  private hojaAsistencia(hoja: Worksheet, r: ResumenDashboard): void {
    this.encabezado(hoja, [
      { header: 'Servicio', key: 'servicio', width: 30 },
      { header: 'Cantidad de servicios', key: 'cantidad', width: 20 },
      { header: 'Asistencia total', key: 'asistencia', width: 18 },
      { header: 'Promedio', key: 'promedio', width: 14 },
      { header: 'Variación del promedio', key: 'variacion', width: 28 },
    ]);
    for (const s of r.asistenciaPorServicio) {
      hoja.addRow({
        servicio: s.etiqueta,
        cantidad: s.cantidad,
        asistencia: s.asistencia,
        promedio: s.promedio,
        variacion: this.textoVariacion(s.variacionPromedio),
      });
    }
  }

  private hojaUnidades(hoja: Worksheet, unidades: UnidadFila[]): void {
    this.encabezado(hoja, [
      { header: 'Tipo', key: 'tipo', width: 14 },
      { header: 'Unidad', key: 'unidad', width: 32 },
      { header: 'Congregación', key: 'congregacion', width: 28 },
      { header: 'País', key: 'pais', width: 18 },
      { header: 'Obrero(s)', key: 'obreros', width: 36 },
      { header: 'Estado del informe', key: 'estado', width: 20 },
      { header: 'Asistencia general', key: 'asistencia', width: 26 },
      { header: 'Prom. por servicio', key: 'promedio', width: 26 },
      { header: 'Visitas', key: 'visitas', width: 26 },
      { header: 'Act. espirituales', key: 'espirituales', width: 26 },
      { header: 'Alertas', key: 'alertas', width: 10 },
    ]);
    for (const f of unidades) {
      hoja.addRow({
        tipo: f.unidad.tipo === 'CAMPO' ? 'Campo' : 'Congregación',
        unidad: f.unidad.nombre,
        congregacion: f.unidad.congregacion ?? '',
        pais: f.unidad.pais ?? '',
        obreros: f.obreros.join(', '),
        estado: ETIQUETAS_ESTADO_ENTREGA[f.estadoEntrega],
        asistencia: this.textoVariacion(f.indicadores['asistenciaGeneral']),
        promedio: this.textoVariacion(f.indicadores['promedioAsistenciaServicio']),
        visitas: this.textoVariacion(f.indicadores['visitasTotales']),
        espirituales: this.textoVariacion(f.indicadores['actividadesEspirituales']),
        alertas: f.alertas,
      });
    }
    hoja.autoFilter = { from: 'A1', to: 'K1' };
  }

  private hojaAlertas(hoja: Worksheet, alertas: AlertaDashboard[]): void {
    this.encabezado(hoja, [
      { header: 'Nivel', key: 'nivel', width: 18 },
      { header: 'Tipo', key: 'tipo', width: 26 },
      { header: 'Unidad', key: 'unidad', width: 30 },
      { header: 'Congregación', key: 'congregacion', width: 26 },
      { header: 'País', key: 'pais', width: 18 },
      { header: 'Mensaje', key: 'mensaje', width: 80 },
    ]);
    for (const a of alertas) {
      hoja.addRow({
        nivel: a.nivel === 'ATENCION' ? 'Requiere atención' : 'Informativa',
        tipo: ETIQUETAS_TIPO_ALERTA[a.tipo],
        unidad: a.unidad.nombre,
        congregacion: a.unidad.congregacion ?? '',
        pais: a.unidad.pais ?? '',
        mensaje: a.mensaje,
      });
    }
    hoja.autoFilter = { from: 'A1', to: 'F1' };
  }

  // ---------------------------------------------------------------- PDF

  async exportarPdf(filtros: FiltrosDashboard, alcance: string): Promise<void> {
    const { resumen: r, alertas } = await this.obtenerDatos(filtros, false);
    const c = r.cobertura;
    const encabezadoTabla = (textos: string[]) => textos.map((t) => ({ text: t, style: 'th' }));
    const numero = (v: number | null) => (v === null ? '—' : v.toLocaleString('es', { maximumFractionDigits: 1 }));

    const contenido: any[] = [
      { text: 'Dashboard Ejecutivo de Supervisión Congregacional', style: 'titulo' },
      {
        text: [
          { text: 'Periodo: ', bold: true }, `${r.contexto.periodo.etiqueta}   `,
          { text: 'Comparado con el ', bold: true }, `${r.contexto.descripcionComparacion}   `,
          { text: 'Alcance: ', bold: true }, alcance,
        ],
        margin: [0, 0, 0, 10],
      },
      { text: 'Cobertura', style: 'subtitulo' },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            encabezadoTabla(['Unidades', 'Con obrero', 'Entregados', 'En elaboración', 'Pendientes', '% con informe']),
            [c.unidades, c.conObrero, c.entregados, c.enElaboracion, c.pendientes,
              c.porcentajeConInforme === null ? '—' : `${numero(c.porcentajeConInforme)} %`].map((t) => ({ text: String(t), alignment: 'center' })),
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10],
      },
      { text: 'Indicadores', style: 'subtitulo' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 70, 70, 120],
          body: [
            encabezadoTabla(['Indicador', 'Anterior', 'Actual', 'Variación']),
            ...r.indicadores.map((i) => [
              i.etiqueta,
              { text: numero(i.variacion.anterior), alignment: 'right' },
              { text: numero(i.valorPeriodo), alignment: 'right' },
              { text: this.textoVariacion(i.variacion), alignment: 'right' },
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10],
      },
    ];

    if (r.asistenciaPorServicio.length) {
      contenido.push(
        { text: 'Asistencia por servicio', style: 'subtitulo' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 60, 70, 60, 120],
            body: [
              encabezadoTabla(['Servicio', 'Cantidad', 'Asistencia', 'Promedio', 'Variación']),
              ...r.asistenciaPorServicio.map((s) => [
                s.etiqueta,
                { text: numero(s.cantidad), alignment: 'right' },
                { text: numero(s.asistencia), alignment: 'right' },
                { text: numero(s.promedio), alignment: 'right' },
                { text: this.textoVariacion(s.variacionPromedio), alignment: 'right' },
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10],
        },
      );
    }

    contenido.push(
      { text: `Alertas (${alertas.length})`, style: 'subtitulo', pageBreak: 'before' },
      alertas.length
        ? {
            table: {
              headerRows: 1,
              widths: [80, 110, '*'],
              body: [
                encabezadoTabla(['Tipo', 'Unidad', 'Mensaje']),
                ...alertas.map((a) => [ETIQUETAS_TIPO_ALERTA[a.tipo], a.unidad.nombre, a.mensaje]),
              ],
            },
            layout: 'lightHorizontalLines',
            fontSize: 8,
          }
        : { text: 'No hay alertas para los filtros seleccionados.', italics: true },
      { text: NOTA_COMPARACION, style: 'nota', margin: [0, 15, 0, 0] },
    );

    const documento: any = {
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      pageMargins: [30, 30, 30, 40],
      content: contenido,
      footer: (actual: number, total: number) => ({
        text: `Generado ${new Date(r.contexto.generadoEn).toLocaleString('es')} · Página ${actual} de ${total}`,
        alignment: 'center',
        fontSize: 8,
        color: '#6b7280',
      }),
      styles: {
        titulo: { fontSize: 16, bold: true, color: '#1e66b8', margin: [0, 0, 0, 6] },
        subtitulo: { fontSize: 12, bold: true, color: '#1e66b8', margin: [0, 6, 0, 4] },
        th: { bold: true, fillColor: '#e8f0fb' },
        nota: { fontSize: 8, italics: true, color: '#6b7280' },
      },
      defaultStyle: { fontSize: 9 },
    };

    if (!(pdfMake as any).vfs) {
      (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || pdfFonts;
    }
    pdfMake.createPdf(documento).download(this.nombreArchivo(r, 'pdf'));
  }
}
