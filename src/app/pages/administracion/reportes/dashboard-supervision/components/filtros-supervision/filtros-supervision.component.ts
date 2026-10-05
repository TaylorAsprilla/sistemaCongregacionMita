import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FiltrosDashboard,
  FiltrosDisponibles,
  ModoComparacion,
} from 'src/app/core/interfaces/dashboard-supervision.interface';

@Component({
  selector: 'app-filtros-supervision',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filtros-supervision.component.html',
  styleUrls: ['./filtros-supervision.component.scss'],
})
export class FiltrosSupervisionComponent {
  disponibles = input.required<FiltrosDisponibles>();
  filtros = input.required<FiltrosDashboard>();
  cargando = input(false);
  aplicar = output<FiltrosDashboard>();

  anio = signal<number>(0);
  trimestre = signal<number>(1);
  paisId = signal<number | null>(null);
  congregacionId = signal<number | null>(null);
  campoId = signal<number | null>(null);
  comparacion = signal<ModoComparacion>('TRIMESTRE_ANTERIOR');

  congregaciones = computed(() => {
    const pais = this.paisId();
    return this.disponibles().congregaciones.filter((c) => pais === null || c.pais_id === pais);
  });

  campos = computed(() => {
    const congregacion = this.congregacionId();
    if (congregacion === null) {
      const ids = new Set(this.congregaciones().map((c) => c.id));
      return this.paisId() === null
        ? this.disponibles().campos
        : this.disponibles().campos.filter((c) => c.congregacion_id !== null && ids.has(c.congregacion_id!));
    }
    return this.disponibles().campos.filter((c) => c.congregacion_id === congregacion);
  });

  constructor() {
    effect(() => {
      const f = this.filtros();
      this.anio.set(f.anio);
      this.trimestre.set(f.trimestre);
      this.paisId.set(f.pais_id);
      this.congregacionId.set(f.congregacion_id);
      this.campoId.set(f.campo_id);
      this.comparacion.set(f.comparacion);
    });
  }

  cambiarPais(valor: number | null): void {
    this.paisId.set(valor);
    this.congregacionId.set(null);
    this.campoId.set(null);
  }

  cambiarCongregacion(valor: number | null): void {
    this.congregacionId.set(valor);
    this.campoId.set(null);
  }

  enviar(): void {
    this.aplicar.emit({
      anio: Number(this.anio()),
      trimestre: Number(this.trimestre()),
      pais_id: this.paisId(),
      congregacion_id: this.congregacionId(),
      campo_id: this.campoId(),
      comparacion: this.comparacion(),
    });
  }

  limpiar(): void {
    const activo = this.disponibles().periodoActivo;
    this.anio.set(activo.anio);
    this.trimestre.set(activo.trimestre);
    this.cambiarPais(null);
    this.comparacion.set('TRIMESTRE_ANTERIOR');
    this.enviar();
  }
}
