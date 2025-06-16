import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Pipe } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GemelosService } from 'src/app/services/gemelos/gemelos.service';
import { FormsModule } from '@angular/forms';
import { UsuarioInterface, UsuariosPorCongregacionInterface } from 'src/app/core/interfaces/usuario.interface';
import { Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-ver-grupo-de-gemelos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ver-grupo-de-gemelos.component.html',
  styleUrl: './ver-grupo-de-gemelos.component.scss',
})
export default class VerGrupoDeGemelosComponent {
  grupos: any[] = [];
  gruposFiltrados: any[] = [];
  selectedDate: string = ''; // tipo string para enlazar con input date

  @Output() onCrearGemelos = new EventEmitter<void>();

  @Input() totalGemelos: number = 0;
  // @Input() gemelos: GemelosService[] = [];
  @Input() usuarios: UsuariosPorCongregacionInterface[] = [];

  isFiltrosVisibles: boolean = false;
  filtrarTexto: string = '';
  // usuariosFiltrados: UsuariosPorCongregacionInterface[] = [];

  constructor(private gemelosService: GemelosService, private router: Router) {}

  ngOnInit(): void {
    this.gemelosService.getGruposGemelos().subscribe({
      next: (res) => {
        if (res.ok) {
          this.grupos = res.grupos;
          this.gruposFiltrados = res.grupos;
          this.totalGemelos = res.grupos.length;
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos', err);
      },
    });
  }

  crearGemelos() {
    this.router.navigateByUrl(`/${RUTAS.SISTEMA}/${RUTAS.GRUPO_GEMELOS}`);
  }

  esconderFiltros() {
    this.isFiltrosVisibles = !this.isFiltrosVisibles;
  }

  resetFiltros() {
    if (!this.grupos || this.grupos.length === 0) {
      return; // Si no hay usuarios, no realiza ninguna operación
    }
    // Reinicia los filtros a sus valores iniciales
    this.selectedDate = '';
    this.filtrarTexto = '';

    // Restaura la lista completa sin cálculos adicionales
    this.gruposFiltrados = [...this.grupos];
    // Actualiza los contadores y reinicia la paginación
    this.totalGemelos = this.gruposFiltrados.length;
    // this.pagina = 1;
  }

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    console.log(this.selectedDate);
    // const fecha = this.selectedDate ? new Date(this.selectedDate) : undefined;
    this.gruposFiltrados = this.filterUsuarios(this.filterText, this.selectedDate);
    // console.log(this.gruposFiltrados.length);
    // this.grupos.forEach((grupo: any) => {
    //   console.log(grupo.usuarios);
    // });
    this.totalGemelos = this.gruposFiltrados.length;
    // this.pagina = 1;
  }

  filtrarPorEdad() {
    // Si ambos campos están vacíos, reiniciar la lista filtrada
    // if (
    //   (this.edadMinima === null || this.edadMinima === undefined) &&
    //   (this.edadMaxima === null || this.edadMaxima === undefined)
    // ) {
    //   this.usuariosFiltrados = [...this.usuarios]; // Restaurar lista original
    //   this.totalUsuarios = this.usuariosFiltrados.length; // Actualizar total
    //   this.pagina = 1; // Reiniciar la página a la primera
    //   return;
    // }
    // // Si ambos valores están definidos, realizar el filtrado
    // if (
    //   this.edadMinima !== null &&
    //   this.edadMinima !== undefined &&
    //   this.edadMaxima !== null &&
    //   this.edadMaxima !== undefined
    // ) {
    //   this.usuariosFiltrados = this.filterUsuarios(
    //     this.filterText,
    //     this.filtrarPaisTexto,
    //     this.filtrarCongreTexto,
    //     this.filtrarCampoTexto,
    //     this.edadMaxima,
    //     this.edadMinima
    //   );
    //   // Actualizar total y reiniciar la página
    //   this.totalUsuarios = this.usuariosFiltrados.length;
    //   this.pagina = 1;
    // }
  }

  filterUsuarios(filterTerm: string, fecha?: string): any[] {
    const lowerFilterTerm = filterTerm.toLocaleLowerCase();

    // Si no hay filtros, devolvemos todos los grupos
    if (this.grupos.length === 0 && lowerFilterTerm === '' && !fecha) {
      return this.grupos;
    }

    return this.grupos.filter((grupo: any) => {
      const usuarios = grupo.usuarios || [];

      return usuarios.some((usuario: any) => {
        const getSafeString = (value: string | undefined): string => (value ? value.toLocaleLowerCase() : '');

        const nombreCompleto = `${getSafeString(usuario.primerNombre)} ${getSafeString(
          usuario.segundoNombre
        )} ${getSafeString(usuario.primerApellido)} ${getSafeString(usuario.segundoApellido)}`.trim();

        const searchTerms = lowerFilterTerm.split(' ');

        const nombreCompletoMatches = searchTerms.every((term) => nombreCompleto.includes(term));

        // Comparar fecha en formato YYYY-MM-DD directamente (sin convertir a Date)
        let fechaMatches = false;
        console.log(fecha + ' = ' + grupo.fechaNacimientoComun);
        if (fecha && grupo.fechaNacimientoComun) {
          // Normalizar fecha del grupo a solo la parte YYYY-MM-DD
          const grupoFechaStr = grupo.fechaNacimientoComun.substring(0, 10);
          fechaMatches = grupoFechaStr === fecha;
        }

        const cumpleFiltroTexto = lowerFilterTerm === '' || nombreCompletoMatches;
        const cumpleFiltroFecha = !fecha || fechaMatches;
        return cumpleFiltroTexto && cumpleFiltroFecha;
      });
    });
  }

  onDateChange(value: string) {
    this.selectedDate = value;
    console.log('Fecha seleccionada:', this.selectedDate);
    // const fecha = this.selectedDate ? new Date(this.selectedDate) : undefined;
    this.gruposFiltrados = this.filterUsuarios(this.filterText, this.selectedDate);
    console.log(this.gruposFiltrados.length);
    this.totalGemelos = this.gruposFiltrados.length;
  }
}
