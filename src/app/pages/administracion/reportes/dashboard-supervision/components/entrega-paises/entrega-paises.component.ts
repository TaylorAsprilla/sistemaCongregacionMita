import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntregaPais } from 'src/app/core/interfaces/dashboard-supervision.interface';

type OrdenEntrega = 'PORCENTAJE_DESC' | 'PORCENTAJE_ASC' | 'NOMBRE' | 'TOTAL';

interface Segmento {
  clave: 'entregados' | 'enElaboracion' | 'pendientes' | 'sinObrero';
  etiqueta: string;
  clase: string;
}

/**
 * Barras apiladas (100 %) por país con el estado del informe trimestral de sus Congregaciones Ciudad.
 */
@Component({
  selector: 'app-entrega-paises',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entrega-paises.component.html',
  styleUrls: ['./entrega-paises.component.scss'],
})
export class EntregaPaisesComponent {
  paises = input<EntregaPais[]>([]);

  readonly segmentos: Segmento[] = [
    { clave: 'entregados', etiqueta: 'Entregado', clase: 'seg-entregado' },
    { clave: 'enElaboracion', etiqueta: 'En elaboración', clase: 'seg-elaboracion' },
    { clave: 'pendientes', etiqueta: 'Pendiente', clase: 'seg-pendiente' },
    { clave: 'sinObrero', etiqueta: 'Sin obrero', clase: 'seg-sin-obrero' },
  ];

  readonly ordenes: { valor: OrdenEntrega; etiqueta: string }[] = [
    { valor: 'PORCENTAJE_DESC', etiqueta: 'Mayor % con informe' },
    { valor: 'PORCENTAJE_ASC', etiqueta: 'Menor % con informe' },
    { valor: 'TOTAL', etiqueta: 'Más congregaciones' },
    { valor: 'NOMBRE', etiqueta: 'País (A-Z)' },
  ];

  orden = signal<OrdenEntrega>('PORCENTAJE_DESC');

  filas = computed(() => {
    const lista = [...this.paises()];
    const pct = (p: EntregaPais) => p.porcentajeConInforme ?? -1;
    const nombre = (a: EntregaPais, b: EntregaPais) => a.pais.localeCompare(b.pais, 'es');
    switch (this.orden()) {
      case 'PORCENTAJE_DESC':
        return lista.sort((a, b) => pct(b) - pct(a) || b.total - a.total || nombre(a, b));
      case 'PORCENTAJE_ASC':
        return lista.sort((a, b) => pct(a) - pct(b) || b.total - a.total || nombre(a, b));
      case 'TOTAL':
        return lista.sort((a, b) => b.total - a.total || nombre(a, b));
      default:
        return lista.sort(nombre);
    }
  });

  totales = computed<EntregaPais>(() => {
    const t: EntregaPais = {
      pais_id: null,
      pais: 'Total',
      total: 0,
      entregados: 0,
      enElaboracion: 0,
      pendientes: 0,
      sinObrero: 0,
      porcentajeConInforme: null,
    };
    for (const p of this.paises()) {
      t.total += p.total;
      t.entregados += p.entregados;
      t.enElaboracion += p.enElaboracion;
      t.pendientes += p.pendientes;
      t.sinObrero += p.sinObrero;
    }
    t.porcentajeConInforme = t.total > 0 ? Math.round((this.conInforme(t) / t.total) * 1000) / 10 : null;
    return t;
  });

  ancho(p: EntregaPais, s: Segmento): number {
    return p.total > 0 ? (p[s.clave] / p.total) * 100 : 0;
  }

  conInforme(p: EntregaPais): number {
    return p.entregados + p.enElaboracion;
  }

  descripcion(p: EntregaPais): string {
    return (
      `${p.pais}: ${this.conInforme(p)} de ${p.total} congregaciones con informe. ` +
      this.segmentos.map((s) => `${s.etiqueta}: ${p[s.clave]}`).join(', ')
    );
  }
}
