import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { CampoService } from 'src/app/services/campo/campo.service';
import Swal from 'sweetalert2';

import { CargandoInformacionComponent } from '../../../../components/cargando-informacion/cargando-informacion.component';
import { FiltrosComponent } from '../../../../components/filtros/filtros.component';
import { FilterByNombrePipePipe } from '../../../../pipes/FilterByNombrePipe/filter-by-nombre-pipe.pipe';

import { CommonModule } from '@angular/common';
import { ExportarExcelService } from 'src/app/services/exportar-excel/exportar-excel.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';

@Component({
  selector: 'app-campos',
  templateUrl: './campos.component.html',
  styleUrls: ['./campos.component.css'],
  standalone: true,
  imports: [CargandoInformacionComponent, FilterByNombrePipePipe, CommonModule, FormsModule],
})
export class CamposComponent implements OnInit {
  cargando: boolean = true;
  campos: CampoModel[] = [];
  obreros: UsuarioModel[] = [];
  paises: CongregacionPaisModel[] = [];
  congregaciones: CongregacionModel[] = [];
  filtroNombre: string = '';

  isFiltrosVisibles: boolean = false;
  congregacionesFiltradas: CongregacionModel[] = [];
  camposFiltrados: CampoModel[] = [];
  filtrarTexto: string = '';
  @Input() nombreArchivo: string = '';
  filtrarPaisTexto: string = '';
  originalPais: string = '';
  congregacionSubscription: Subscription;

  pagina: number = 1;

  filtrarCongreTexto: string = '';
  originalCongre: string = '';
  filtrarCampoTexto: string = '';
  @Input() totalCampos: number = 0;
  congregacionesFiltradasId: number[];

  constructor(
    private router: Router,
    private campoService: CampoService,
    private activatedRoute: ActivatedRoute,
    private exportarExcelService: ExportarExcelService,
    private congregacionService: CongregacionService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data: { obrero: UsuarioModel[]; pais: CongregacionPaisModel[]; congregacion: CongregacionModel[] }) => {
        this.obreros = data.obrero;
        this.paises = data.pais;
        this.congregaciones = data.congregacion;
      }
    );

    this.cargarCongregaciones();
    this.cargarCampos();
  }

  cargarCampos() {
    this.cargando = true;
    this.campoService
      .getCampos()
      .pipe(delay(100))
      .subscribe((campos: CampoModel[]) => {
        this.campos = campos;
        this.camposFiltrados = campos;
        this.cargando = false;
      });
  }

  cargarCongregaciones() {
    this.cargando = true;
    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .pipe(delay(100))
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
        this.congregacionesFiltradas = congregaciones;
        this.cargando = false;
      });
  }

  borrarCampo(campo: CampoModel) {
    Swal.fire({
      title: '¿Borrar Campo?',
      text: `Esta seguro de borrar el campo de ${campo.campo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.campoService.eliminarCampo(campo).subscribe((campoEliminado) => {
          Swal.fire('¡Deshabilitado!', `El campo ${campo.campo} fue deshabilitado correctamente`, 'success');

          this.cargarCampos();
        });
      }
    });
  }

  activarCampo(campo: CampoModel) {
    Swal.fire({
      title: 'Activar Campo',
      text: `Esta seguro de activar el campo de ${campo.campo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.campoService.activarCampo(campo).subscribe((campoActivo) => {
          Swal.fire('¡Activado!', `El campo ${campo.campo} fue activado correctamente`, 'success');

          this.cargarCampos();
        });
      }
    });
  }

  actualizarCampo(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CAMPOS}/${id}`);
  }

  crearCampo() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CAMPOS}/${nuevo}`);
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

  buscarPais(idPais: number): string | undefined {
    return this.paises.find((pais) => pais.id === idPais)?.pais;
  }

  buscarCongregacion(idCongregacion: number): { congregacion?: string; pais?: string } {
    const congregacion = this.congregaciones.find((congregacion) => congregacion.id === idCongregacion);

    if (congregacion) {
      const pais = this.buscarPais(congregacion.pais_id);
      return { congregacion: congregacion.congregacion, pais };
    }

    return {}; // Retorna un objeto vacío si no se encuentra la congregación
  }

  obtenerFiltroNombre(nombre: string) {
    this.filtroNombre = nombre;
  }

  esconderFiltros() {
    this.isFiltrosVisibles = !this.isFiltrosVisibles;
  }

  exportarDatosFiltrados(): void {
    const datosParaExportar = this.camposFiltrados.map((campo) => ({
      ID: campo.id,
      Nombre: campo.campo,
      Obrero: this.buscarObrero(campo.idObreroEncargado),
      Obrero_Auxiliar: this.buscarObrero(campo.idObreroEncargadoDos),
      Congregación: this.buscarCongregacion(campo.congregacion_id)['congregacion'] || 'N/A',
      País: this.buscarCongregacion(campo.congregacion_id)['pais'] || 'N/A',
    }));
    this.exportarExcelService.exportToExcel(datosParaExportar, this.nombreArchivo);
  }
  resetFiltros() {
    if (!this.campos || this.campos.length === 0) {
      return; // Si no hay usuarios, no realiza ninguna operación
    }

    // Reinicia los filtros a sus valores iniciales
    this.originalPais = '';
    this.originalCongre = '';
    this.filtrarPaisTexto = '';
    this.filtrarCongreTexto = '';
    this.filtrarCampoTexto = '';
    this.filterText = '';

    // Restaura la lista completa sin cálculos adicionales
    this.camposFiltrados = [...this.campos];
    this.congregacionesFiltradas = this.congregaciones;
    // Actualiza los contadores y reinicia la paginación
    this.totalCampos = this.camposFiltrados.length;
    this.pagina = 1;
  }

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    this.camposFiltrados = this.filterCampos(this.filterText, this.filtrarPaisTexto, this.filtrarCongreTexto);
    this.totalCampos = this.camposFiltrados.length;
    this.pagina = 1;
  }

  filterCampos(filterTerm: string, pais: string, congregacion: string): CampoModel[] {
    const lowerFilterTerm = this.normalizeString(filterTerm.trim());
    const lowerPais = pais.trim().toLocaleLowerCase();
    const lowerCongregacion = congregacion.trim().toLocaleLowerCase();

    if (!this.campos.length || (!lowerFilterTerm && !lowerPais && !lowerCongregacion)) {
      return this.campos;
    }

    return this.campos.filter((campo: CampoModel) => {
      const fetchedCongregacion = this.buscarCongregacion(campo.congregacion_id);
      const fetchedPais = fetchedCongregacion?.pais?.toLocaleLowerCase() || '';
      const fetchedCongre = fetchedCongregacion?.congregacion?.toLocaleLowerCase() || '';
      const camp = this.normalizeString(campo.campo?.toLocaleLowerCase() || '');
      const obrero = this.normalizeString(this.buscarObrero(campo.idObreroEncargado)?.toLocaleLowerCase() || '');
      const obreroDos = this.normalizeString(this.buscarObrero(campo.idObreroEncargadoDos)?.toLocaleLowerCase() || '');

      return (
        (lowerPais ? fetchedPais.includes(lowerPais) : true) &&
        (lowerCongregacion ? fetchedCongre.includes(lowerCongregacion) : true) &&
        (!lowerFilterTerm ||
          camp.includes(lowerFilterTerm) ||
          obrero.includes(lowerFilterTerm) ||
          obreroDos.includes(lowerFilterTerm))
      );
    });
  }

  filtrarPais(value: any) {
    this.filtrarCongreTexto = '';
    this.filtrarCampoTexto = '';
    this.filterText = '';
    if (value.pais === undefined) {
      this.filtrarPaisTexto = '';
      this.congregacionesFiltradas = this.congregaciones;
      this.camposFiltrados = this.campos;
    } else {
      this.originalPais = value.pais;
      this.filtrarPaisTexto = value.pais;
      this.filtrarCongregacionesPorPais(value.id);
      this.filtrarCamposPorPais();
    }

    this.totalCampos = this.camposFiltrados.length;
    this.pagina = 1;
  }

  filtrarCongregacion(value: any) {
    this.filtrarCampoTexto = '';
    this.filterText = '';
    this.filtrarPaisTexto = '';
    if (value.congregacion === undefined) {
      this.filtrarCongreTexto = '';
      this.camposFiltrados = this.campos;
    } else {
      this.originalCongre = value.congregacion;
      this.filtrarCongreTexto = value.congregacion;
      this.filtrarCamposPorCongregacion(value.id);
    }
    this.totalCampos = this.camposFiltrados.length;
    this.pagina = 1;
  }

  filtrarCongregacionesPorPais(pais: string) {
    this.congregacionesFiltradas = this.congregaciones?.filter(
      (congregacionBuscar) => congregacionBuscar.pais_id === parseInt(pais)
    );
  }

  filtrarCamposPorCongregacion(congre: string) {
    this.camposFiltrados = this.campos?.filter((camposBuscar) => camposBuscar.congregacion_id === parseInt(congre));
  }
  filtrarCamposPorPais() {
    this.congregacionesFiltradasId = [];
    for (let i = 0; i < this.congregacionesFiltradas.length; i++) {
      this.congregacionesFiltradasId.push(this.congregacionesFiltradas[i].id);
    }
    this.camposFiltrados = this.campos?.filter((campoBuscar) =>
      this.congregacionesFiltradasId.includes(campoBuscar.congregacion_id)
    );
  }

  // Función para convertir a minúsculas y eliminar acentos
  private normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // elimina tildes para la busqueda
      .toLowerCase();
  }
}
