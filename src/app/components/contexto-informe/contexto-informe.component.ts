import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InformeService } from 'src/app/services/informe/informe.service';

@Component({
  selector: 'app-contexto-informe',
  standalone: true,
  template: `
    @if (informe) {
      <div class="contexto-informe" role="note">
        <strong>Congregación {{ tipo }}: {{ informe.nombre_unidad || 'Sin nombre identificado' }}</strong>
        <span> · {{ periodo }}</span>
      </div>
    }
  `,
  styles: [`
    .contexto-informe {
      margin-bottom: 1rem;
      padding: .65rem .85rem;
      border-left: 3px solid #6c757d;
      background: #f8f9fa;
      color: #343a40;
      font-size: .9rem;
    }
  `],
})
export class ContextoInformeComponent implements OnInit {
  private informeService = inject(InformeService);
  private destroyRef = inject(DestroyRef);
  informe: any = null;

  get tipo(): string {
    return ({ PAIS: 'País', CONGREGACION: 'Ciudad', CAMPO: 'Campo' } as Record<string, string>)[
      this.informe?.tipo_congregacion
    ] || '';
  }

  get periodo(): string {
    const fecha = this.informe?.periodo;
    if (!fecha) return 'Período no identificado';
    const [anio, mes] = fecha.slice(0, 10).split('-').map(Number);
    return `${Math.ceil(mes / 3)}º trimestre de ${anio}`;
  }

  ngOnInit(): void {
    if (!this.informeService.informeActivoId) return;
    this.informeService.obtenerContextoActivo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (informe) => this.informe = informe, error: () => {
        this.informe = this.informeService.informeActivo;
      } });
  }
}
