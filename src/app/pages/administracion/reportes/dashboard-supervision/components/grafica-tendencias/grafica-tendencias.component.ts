import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { PuntoSerie, Serie } from 'src/app/core/interfaces/dashboard-supervision.interface';

/**
 * Gráfica de líneas de un indicador a lo largo de los últimos trimestres.
 * Los trimestres sin información no se dibujan como cero: se omiten y se avisa debajo.
 */
@Component({
  selector: 'app-grafica-tendencias',
  standalone: true,
  imports: [FormsModule, NgxChartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
      <label class="form-label mb-0 fw-semibold small" [attr.for]="idSelector">Indicador</label>
      <select [id]="idSelector" class="form-select form-select-sm selector" [ngModel]="claveSeleccionada()"
        (ngModelChange)="claveSeleccionada.set($event)">
        @if (informesPorPeriodo().length) {
          <option value="__informes">Informes recibidos</option>
        }
        @for (s of series(); track s.clave) {
          <option [value]="s.clave">{{ s.etiqueta }}</option>
        }
      </select>
    </div>

    @if (datos()[0].series.length) {
      <div class="grafica" role="img" [attr.aria-label]="'Tendencia de ' + etiqueta()">
        <ngx-charts-line-chart
          [results]="datos()"
          [scheme]="esquema"
          [xAxis]="true"
          [yAxis]="true"
          [showGridLines]="true"
          [autoScale]="false"
          [roundDomains]="true"
          [legend]="false"
          [animations]="false"
          [timeline]="false"
        ></ngx-charts-line-chart>
      </div>
      @if (sinDatos().length) {
        <small class="text-muted d-block mt-1">
          <i class="fas fa-circle-info" aria-hidden="true"></i>
          Sin información en: {{ sinDatos().join(', ') }}
        </small>
      }
    } @else {
      <p class="text-muted text-center my-4">Sin información para este indicador en los periodos consultados.</p>
    }
  `,
  styles: [
    `
      .grafica { height: 280px; width: 100%; }
      .selector { max-width: 320px; }
      @media (max-width: 576px) {
        .grafica { height: 220px; }
        .selector { max-width: 100%; }
      }
    `,
  ],
})
export class GraficaTendenciasComponent {
  private static contador = 0;
  readonly idSelector = `selectorTendencia${++GraficaTendenciasComponent.contador}`;

  series = input<Serie[]>([]);
  informesPorPeriodo = input<PuntoSerie[]>([]);
  claveInicial = input('asistenciaGeneral');

  /** Se reinicia al indicador inicial cuando cambian las series, pero el usuario puede cambiarlo. */
  claveSeleccionada = linkedSignal<string>(() => {
    const inicial = this.claveInicial();
    const series = this.series();
    return series.some((s) => s.clave === inicial) ? inicial : (series[0]?.clave ?? '__informes');
  });

  esquema: Color = {
    name: 'supervision',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1e66b8'],
  };

  private puntos = computed<PuntoSerie[]>(() => {
    const clave = this.claveSeleccionada();
    if (clave === '__informes') return this.informesPorPeriodo();
    return this.series().find((s) => s.clave === clave)?.puntos ?? [];
  });

  etiqueta = computed(() => {
    const clave = this.claveSeleccionada();
    if (clave === '__informes') return 'Informes recibidos';
    return this.series().find((s) => s.clave === clave)?.etiqueta ?? '';
  });

  datos = computed(() => [
    {
      name: this.etiqueta(),
      series: this.puntos()
        .filter((p) => p.valor !== null)
        .map((p) => ({ name: p.periodo, value: p.valor as number })),
    },
  ]);

  sinDatos = computed(() => this.puntos().filter((p) => p.valor === null).map((p) => p.periodo));
}
