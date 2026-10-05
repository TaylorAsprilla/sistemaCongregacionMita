import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Variacion } from 'src/app/core/interfaces/dashboard-supervision.interface';

/** Muestra una variación con flecha + texto (nunca sólo color) y el detalle anterior → actual. */
@Component({
  selector: 'app-indicador-variacion',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variacion(); as v) {
      <span class="variacion" [class]="clase()" [attr.title]="titulo()" [attr.aria-label]="titulo()">
        @if (v.estado === 'VARIACION') {
          <i class="fas" [class.fa-arrow-up]="v.direccion === 'SUBE'" [class.fa-arrow-down]="v.direccion === 'BAJA'"
            [class.fa-arrows-left-right]="v.direccion === 'ESTABLE'" aria-hidden="true"></i>
          {{ (v.porcentaje ?? 0) > 0 ? '+' : '' }}{{ v.porcentaje | number: '1.0-1' : 'es' }} %
        } @else {
          <i class="fas fa-circle-info" aria-hidden="true"></i>
          {{ v.mensaje }}
        }
      </span>
      @if (mostrarDetalle() && v.anterior !== null && v.actual !== null) {
        <small class="d-block text-muted detalle">
          {{ v.anterior | number: '1.0-1' : 'es' }} → {{ v.actual | number: '1.0-1' : 'es' }}
        </small>
      }
    }
  `,
  styles: [
    `
      .variacion {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-weight: 600;
        font-size: 0.85rem;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        white-space: nowrap;
      }
      .var-sube-fuerte { background: #d1f2e0; color: #0f6b3a; }
      .var-sube { background: #e7f6ee; color: #1b7a47; }
      .var-estable { background: #eef1f4; color: #4b5563; }
      .var-baja { background: #fdf0e3; color: #a14d00; }
      .var-baja-fuerte { background: #fbe0e0; color: #a12020; }
      .variacion i { font-size: 0.95em; }
      .var-sube-fuerte i, .var-sube i { color: #16a34a !important; }
      .var-baja i { color: #ea580c !important; }
      .var-baja-fuerte i { color: #dc2626 !important; }
      .var-estable i { color: #1976d2 !important; }
      .var-sin-dato i { color: #1976d2 !important; }
      .var-sin-dato { background: transparent; color: #6b7280; font-weight: 400; font-style: italic; white-space: normal; padding-left: 0; }
      .detalle { font-size: 0.75rem; margin-top: 0.15rem; }
    `,
  ],
})
export class IndicadorVariacionComponent {
  variacion = input<Variacion | null | undefined>(null);
  mostrarDetalle = input(false);

  clase = computed(() => {
    const v = this.variacion();
    if (!v || v.estado !== 'VARIACION') return 'variacion var-sin-dato';
    switch (v.tendencia) {
      case 'INCREMENTO_SIGNIFICATIVO':
        return 'variacion var-sube-fuerte';
      case 'INCREMENTO_MODERADO':
        return 'variacion var-sube';
      case 'DISMINUCION_MODERADA':
        return 'variacion var-baja';
      case 'DISMINUCION_SIGNIFICATIVA':
        return 'variacion var-baja-fuerte';
      default:
        return 'variacion var-estable';
    }
  });

  titulo = computed(() => {
    const v = this.variacion();
    if (!v) return '';
    if (v.estado !== 'VARIACION') return v.mensaje;
    return `${v.mensaje} (anterior: ${v.anterior}, actual: ${v.actual})`;
  });
}
