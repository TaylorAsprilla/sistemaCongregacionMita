import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DivisaModel } from 'src/app/core/models/divisa.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ListarUsuario } from 'src/app/core/interfaces/usuario.interface';
import { RUTAS } from 'src/app/routes/menu-items';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

import { CargandoInformacionComponent } from '../../../../components/cargando-informacion/cargando-informacion.component';
import { FiltrosComponent } from '../../../../components/filtros/filtros.component';
import { FilterByNombrePipePipe } from '../../../../pipes/FilterByNombrePipe/filter-by-nombre-pipe.pipe';
import { ExportarExcelService } from 'src/app/services/exportar-excel/exportar-excel.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.css'],
  standalone: true,
  imports: [CargandoInformacionComponent, FilterByNombrePipePipe, CommonModule, FormsModule],
})
export class PaisesComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private paisService = inject(PaisService);
  private usuarioService = inject(UsuarioService);
  private activatedRoute = inject(ActivatedRoute);
  private exportarExcelService = inject(ExportarExcelService);

  cargando: boolean = true;
  paises: CongregacionPaisModel[] = [];
  divisas: DivisaModel[] = [];
  obreros: UsuarioModel[] = [];
  usuarios: UsuarioModel[] = [];

  filtroNombre: string = '';

  // Subscription
  paisSubscription: Subscription;

  isFiltrosVisibles: boolean = false;
  filtrarTexto: string = '';

  paisesFiltrados: CongregacionPaisModel[] = [];
  pagina: number = 1;

  @Input() nombreArchivo: string = '';
  @Input() totalPaises: number = 0;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { divisas: DivisaModel[]; obrero: UsuarioModel[] }) => {
      this.divisas = data.divisas;
      this.obreros = data.obrero;
    });

    // Cargar todos los usuarios para buscar administradores
    this.usuarioService.listarTodosLosUsuarios().subscribe((response: ListarUsuario) => {
      this.usuarios = response.usuarios;
    });

    this.cargarPaises();
  }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
  }

  cargarPaises() {
    this.cargando = true;
    this.paisSubscription = this.paisService
      .getPaises()
      .pipe(delay(100))
      .subscribe((pais: CongregacionPaisModel[]) => {
        this.paises = pais;
        this.paisesFiltrados = pais;
        this.cargando = false;
      });
  }

  borrarPais(pais: CongregacionPaisModel) {
    Swal.fire({
      title: '¿Borrar País?',
      text: `Esta seguro de borrar el país ${pais.pais}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paisService.eliminarPais(pais).subscribe(() => {
          Swal.fire('¡Deshabilitado!', `El país ${pais.pais} fue deshabilitado correctamente`, 'success');

          this.cargarPaises();
        });
      }
    });
  }

  activarPais(pais: CongregacionPaisModel) {
    Swal.fire({
      title: 'Activar País',
      text: `Esta seguro de activar el país ${pais.pais}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paisService.activarPais(pais).subscribe((paisActivo: CongregacionPaisModel) => {
          Swal.fire('¡Activado!', `El país ${pais.pais} fue activado correctamente`, 'success');

          this.cargarPaises();
        });
      }
    });
  }

  actualizarPais(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.PAISES}/${id}`);
  }

  crearPais() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.PAISES}/${nuevo}`);
  }

  buscarDivisa(idDivisa: number): string {
    const nombreDivisa = this.divisas.find((divisa) => divisa.id === idDivisa)?.divisa;

    if (nombreDivisa !== undefined) {
      return nombreDivisa;
    } else {
      return 'No tiene divisa asignada';
    }
  }

  buscarObrero(idObrero: number): string {
    let obrero = this.obreros.find((obrero) => obrero.id === idObrero);

    const nombreObrero = obrero
      ? obrero?.primerNombre +
        ' ' +
        obrero?.segundoNombre +
        ' ' +
        obrero?.primerApellido +
        ' ' +
        obrero?.segundoApellido
      : 'Sin obrero Asignado';

    return nombreObrero;
  }

  buscarAdministrador(idAdministrador: number | undefined): string {
    if (!idAdministrador) {
      return 'Sin administrador asignado';
    }

    let administrador = this.usuarios.find((usuario) => usuario.id === idAdministrador);

    const nombreAdministrador = administrador
      ? administrador?.primerNombre +
        ' ' +
        administrador?.segundoNombre +
        ' ' +
        administrador?.primerApellido +
        ' ' +
        administrador?.segundoApellido
      : 'Sin administrador asignado';

    return nombreAdministrador;
  }

  obtenerFiltroNombre(nombre: string) {
    this.filtroNombre = nombre;
  }

  exportarDatosFiltrados(): void {
    const datosParaExportar = this.paisesFiltrados.map((pais) => ({
      ID: pais.id,
      Nombre: pais.pais,
      Obrero: this.buscarObrero(pais.idObreroEncargado) || 'N/A',
      Administrador: this.buscarAdministrador(pais.idAdministrador) || 'N/A',
      Divisa: this.buscarDivisa(pais.idDivisa),
    }));
    this.exportarExcelService.exportToExcel(datosParaExportar, this.nombreArchivo);
  }

  esconderFiltros() {
    this.isFiltrosVisibles = !this.isFiltrosVisibles;
  }

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    this.paisesFiltrados = this.filterPaises(this.filterText);
    this.totalPaises = this.paisesFiltrados.length;
    this.pagina = 1;
  }

  resetFiltros() {
    this.filterText = '';
  }

  filterPaises(filterTerm: string): CongregacionPaisModel[] {
    const lowerFilterTerm = this.normalizeString(filterTerm);

    // Si no hay usuarios y los filtros están vacíos, devolvemos todos los usuarios
    if (this.paises.length === 0 && lowerFilterTerm === '') {
      return this.paisesFiltrados;
    } else {
      return this.paises.filter((country: CongregacionPaisModel) => {
        // Utilizamos una función de utilidad para convertir a minúsculas de forma segura
        const getSafeString = (value: string | undefined): string => (value ? value.toLocaleLowerCase() : '');

        const pais = this.normalizeString(getSafeString(country.pais));
        const obrero = this.normalizeString(getSafeString(this.buscarObrero(country.idObreroEncargado)));
        const administrador = this.normalizeString(getSafeString(this.buscarAdministrador(country.idAdministrador)));

        // Filtrar el usuario si alguna de las propiedades contiene el término de búsqueda
        return (
          pais.includes(lowerFilterTerm) || obrero.includes(lowerFilterTerm) || administrador.includes(lowerFilterTerm)
        );
      });
    }
  }

  // Función para convertir a minúsculas y eliminar acentos
  private normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // elimina tildes para la busqueda
      .toLowerCase();
  }
}
