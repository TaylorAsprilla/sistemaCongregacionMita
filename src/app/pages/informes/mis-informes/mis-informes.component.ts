import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RUTAS } from 'src/app/routes/menu-items';
import { InformeService } from 'src/app/services/informe/informe.service';

interface InformePropio {
  id: number;
  estado: string;
  periodo: string | null;
  createdAt: string;
}

@Component({
  selector: 'app-mis-informes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-informes.component.html',
  styleUrl: './mis-informes.component.scss',
})
export class MisInformesComponent implements OnInit {
  private informeService = inject(InformeService);
  private router = inject(Router);

  informes: InformePropio[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.cargarInformes();
  }

  cargarInformes(): void {
    this.cargando = true;
    this.error = '';
    this.informeService
      .getMisInformes()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (informes) => (this.informes = informes),
        error: (error) => {
          console.error('Error al cargar los informes propios:', error);
          this.error = 'No se pudieron cargar tus informes. Intenta nuevamente.';
        },
      });
  }

  periodo(informe: InformePropio): string {
    const fecha = new Date(`${informe.periodo || informe.createdAt}`.slice(0, 10) + 'T00:00:00Z');
    if (Number.isNaN(fecha.getTime())) return 'Período no disponible';
    const trimestre = Math.floor(fecha.getUTCMonth() / 3) + 1;
    return `${trimestre}° trimestre de ${fecha.getUTCFullYear()}`;
  }

  verInforme(informe: InformePropio): void {
    this.router.navigateByUrl(
      `${RUTAS.SISTEMA}/${RUTAS.VER_INFORME}/${informe.id}?origen=${RUTAS.MIS_INFORMES}`,
    );
  }

  estadoCerrado(estado: string): boolean {
    return estado.trim().toLocaleLowerCase() === 'cerrado';
  }
}
