import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RUTAS } from 'src/app/routes/menu-items';
import { InformeService } from 'src/app/services/informe/informe.service';

interface InformePropio {
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
}

@Component({
  selector: 'app-mis-informes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mis-informes.component.html',
  styleUrl: './mis-informes.component.scss',
})
export class MisInformesComponent implements OnInit {
  private informeService = inject(InformeService);
  private router = inject(Router);

  informes: InformePropio[] = [];
  cargando = true;
  error = '';
  busqueda = '';
  anioSeleccionado = '';
  trimestreSeleccionado = '';

  get aniosDisponibles(): number[] {
    return [...new Set(
      this.informes
        .map((informe) => this.fechaPeriodo(informe)?.getUTCFullYear())
        .filter((anio): anio is number => anio !== undefined),
    )].sort((a, b) => b - a);
  }

  get informesFiltrados(): InformePropio[] {
    const busqueda = this.normalizarTexto(this.busqueda.trim());
    return this.informes.filter((informe) => {
      const fecha = this.fechaPeriodo(informe);
      if (this.anioSeleccionado && fecha?.getUTCFullYear() !== Number(this.anioSeleccionado)) {
        return false;
      }
      if (
        this.trimestreSeleccionado &&
        (!fecha || Math.floor(fecha.getUTCMonth() / 3) + 1 !== Number(this.trimestreSeleccionado))
      ) {
        return false;
      }
      if (!busqueda) return true;

      const contenido = [
        informe.nombre_unidad,
        informe.nombre_pais,
        informe.nombre_congregacion,
        informe.nombre_campo,
        informe.tipo_congregacion ? this.tipoUnidad(informe) : '',
        this.periodo(informe),
        ...(informe.responsablesHistoricos ?? []).flatMap((responsable) => [
          responsable.nombre_responsable,
          responsable.tipo_responsabilidad,
        ]),
      ].filter(Boolean).join(' ');
      return this.normalizarTexto(contenido).includes(busqueda);
    });
  }

  get filtrosAplicados(): boolean {
    return Boolean(this.busqueda.trim() || this.anioSeleccionado || this.trimestreSeleccionado);
  }

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
    const fecha = this.fechaPeriodo(informe);
    if (!fecha) return 'Período no disponible';
    const trimestre = Math.floor(fecha.getUTCMonth() / 3) + 1;
    return `${trimestre}° trimestre de ${fecha.getUTCFullYear()}`;
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.anioSeleccionado = '';
    this.trimestreSeleccionado = '';
  }

  private fechaPeriodo(informe: InformePropio): Date | null {
    const fecha = new Date(`${informe.periodo || informe.createdAt}`.slice(0, 10) + 'T00:00:00Z');
    return Number.isNaN(fecha.getTime()) ? null : fecha;
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
  }

  tipoUnidad(informe: InformePropio): string {
    if (!informe.tipo_congregacion) return 'Tipo histórico no disponible';
    return {
      PAIS: 'Congregación País',
      CONGREGACION: 'Congregación Ciudad',
      CAMPO: 'Congregación Campo',
    }[informe.tipo_congregacion];
  }

  verInforme(informe: InformePropio): void {
    this.router.navigateByUrl(
      `${RUTAS.SISTEMA}/${RUTAS.VER_INFORME}/${informe.id}?origen=${RUTAS.MIS_INFORMES}`,
    );
  }
}
