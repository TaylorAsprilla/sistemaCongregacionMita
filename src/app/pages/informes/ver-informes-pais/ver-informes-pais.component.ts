import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import {
  InformeCompletoPais,
  EstadisticasPais,
} from 'src/app/core/interfaces/informe.interface';
import Swal from 'sweetalert2';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-ver-informes-pais',
  templateUrl: './ver-informes-pais.component.html',
  styleUrls: ['./ver-informes-pais.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class VerInformesPaisComponent implements OnInit {
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  // Datos de la API
  informes: InformeCompletoPais[] = [];
  informesFiltrados: InformeCompletoPais[] = [];
  estadisticas: EstadisticasPais | null = null;

  // Filtros
  busqueda: string = '';
  filtroCongregacion: string = '';
  filtroCampo: string = '';

  // Parámetros de consulta
  trimestre: number = 1;
  anio: number = new Date().getFullYear();
  paisId: number = 0;

  // Estados
  cargando: boolean = false;
  errorCarga: boolean = false;

  // Trimestres disponibles
  trimestres = [
    { value: 1, label: 'Primer Trimestre (Enero - Marzo)' },
    { value: 2, label: 'Segundo Trimestre (Abril - Junio)' },
    { value: 3, label: 'Tercer Trimestre (Julio - Septiembre)' },
    { value: 4, label: 'Cuarto Trimestre (Octubre - Diciembre)' },
  ];

  // Años disponibles (últimos 5 años)
  anios: number[] = [];

  ngOnInit(): void {
    this.generarAnios();
    this.obtenerPaisUsuario();
  }

  /**
   * Genera lista de años disponibles
   */
  generarAnios(): void {
    const anioActual = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.anios.push(anioActual - i);
    }
  }

  /**
   * Obtiene el país del usuario supervisor
   */
  obtenerPaisUsuario(): void {
    const usuario = this.usuarioService.usuario;
    if (usuario && usuario.paisId) {
      this.paisId = usuario.paisId;
      this.cargarInformes();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el país del supervisor',
      });
    }
  }

  /**
   * Carga los informes del trimestre
   */
  cargarInformes(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.informeService.getInformesTrimestrePais(this.trimestre, this.anio, this.paisId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.informes = response.informes;
          this.informesFiltrados = [...this.informes];
          this.estadisticas = response.estadisticas;
          this.aplicarFiltros();
        } else {
          this.errorCarga = true;
          Swal.fire({
            icon: 'warning',
            title: 'Sin resultados',
            text: response.msg || 'No se encontraron informes para el período seleccionado',
          });
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar informes:', error);
        this.errorCarga = true;
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los informes. Por favor, intente nuevamente.',
        });
      },
    });
  }

  /**
   * Aplica filtros de búsqueda
   */
  aplicarFiltros(): void {
    this.informesFiltrados = this.informes.filter((informe) => {
      const nombreCompleto = this.obtenerNombreCompleto(informe.usuario).toLowerCase();
      const congregacion = this.obtenerCongregacion(informe.usuario).toLowerCase();
      const campo = this.obtenerCampo(informe.usuario).toLowerCase();

      const cumpleBusqueda =
        !this.busqueda || nombreCompleto.includes(this.busqueda.toLowerCase());

      const cumpleCongregacion =
        !this.filtroCongregacion || congregacion.includes(this.filtroCongregacion.toLowerCase());

      const cumpleCampo = !this.filtroCampo || campo.includes(this.filtroCampo.toLowerCase());

      return cumpleBusqueda && cumpleCongregacion && cumpleCampo;
    });
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroCongregacion = '';
    this.filtroCampo = '';
    this.aplicarFiltros();
  }

  /**
   * Obtiene el nombre completo del obrero
   */
  obtenerNombreCompleto(usuario: any): string {
    return `${usuario.primerNombre} ${usuario.segundoNombre} ${usuario.primerApellido} ${usuario.segundoApellido}`.trim();
  }

  /**
   * Obtiene el nombre de la congregación
   */
  obtenerCongregacion(usuario: any): string {
    return usuario.congregacion?.nombre || 'Sin asignar';
  }

  /**
   * Obtiene el nombre del campo
   */
  obtenerCampo(usuario: any): string {
    return usuario.campo?.nombre || 'Sin asignar';
  }

  /**
   * Calcula el total de actividades
   */
  getTotalActividades(informe: InformeCompletoPais): number {
    return informe.actividades?.length || 0;
  }

  /**
   * Calcula el total de visitas
   */
  getTotalVisitas(informe: InformeCompletoPais): number {
    return informe.visitas?.length || 0;
  }

  /**
   * Calcula el total de logros
   */
  getTotalLogros(informe: InformeCompletoPais): number {
    return informe.logros?.length || 0;
  }

  /**
   * Calcula el total de metas
   */
  getTotalMetas(informe: InformeCompletoPais): number {
    return informe.metas?.length || 0;
  }

  /**
   * Navega al detalle del informe
   */
  verDetalleInforme(informeId: number): void {
    this.router.navigate(['/sistema', RUTAS.VER_INFORME, informeId]);
  }

  /**
   * Exporta los datos a Excel (funcionalidad básica)
   */
  exportarExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Función en desarrollo',
      text: 'La exportación a Excel estará disponible próximamente',
    });
  }

  /**
   * Recarga los informes
   */
  recargar(): void {
    this.cargarInformes();
  }
}
