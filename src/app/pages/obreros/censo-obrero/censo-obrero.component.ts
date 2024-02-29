import Swal from 'sweetalert2';
import { UsuariosPorCongregacionInterface } from './../../../core/interfaces/usuario.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UsuariosPorCongregacionService } from 'src/app/services/usuarios-por-congregacion/usuarios-por-congregacion.service';
import * as XLSX from 'xlsx';

import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-censo-obrero',
  templateUrl: './censo-obrero.component.html',
  styleUrls: ['./censo-obrero.component.scss'],
})
export class CensoObreroComponent implements OnInit, OnDestroy {
  _filterText: string = '';
  usuariosFiltrados: UsuariosPorCongregacionInterface[] = [];

  totalUsuarios: number = 0;
  usuarios: UsuariosPorCongregacionInterface[] = [];

  idCongregacionObrero: number;

  paginaDesde: number = 0;
  pagina: number = 1;
  totalPaginas: number = 0;

  tableSize: number = 50;
  tableSizes: any = [5, 10, 15, 20, 50, 100];

  showIcons: boolean = false;
  selectedContact: number;

  congregacion: string;

  cargando: boolean = true;

  // Subscription
  usuarioSubscription: Subscription;

  get filterText() {
    return this._filterText;
  }

  set filterText(value: string) {
    this._filterText = value;
    console.log('value: ' + value);
    this.usuariosFiltrados = this.filterUsuarios(value);
    console.log(this.usuariosFiltrados);
    this.pagina = 1;
  }

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private usuariosPorCongregacionService: UsuariosPorCongregacionService
  ) {}

  ngOnInit(): void {
    this.idCongregacionObrero = this.usuarioService.usuarioIdCongregacion;
    this.congregacion = this.usuarioService.nombreCongregacion;
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioSubscription = this.usuariosPorCongregacionService
      .listarUsuariosPorCongregacion(this.paginaDesde, this.idCongregacionObrero)
      .subscribe(({ totalUsuarios, usuarios }) => {
        this.totalUsuarios = totalUsuarios;
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: UsuariosPorCongregacionInterface) {
    if (usuario.id === this.usuarioService.usuarioId) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }
    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Esta seguro de borrar a ${usuario.primerNombre} ${usuario.primerApellido}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario.id).subscribe((usuarioEliminado) => {
          Swal.fire(
            '¡Deshabilitado!',
            `${usuario.primerNombre} ${usuario.primerApellido} fue deshabilitado correctamente`,
            'success'
          );

          this.cargarUsuarios();
        });
      }
    });
    this.filterUsuarios(this._filterText);
    return usuario;
  }

  async activarUsuario(usuario: UsuariosPorCongregacionInterface) {
    const usuarioEncontrado: UsuarioModel = await this.buscarUsuario(usuario.id);

    await Swal.fire({
      title: 'Activar Congregación',
      text: `Esta seguro de activar el usuario ${usuario.primerNombre} ${usuario.segundoNombre} ${usuario.primerApellido}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.activarUsuario(usuarioEncontrado).subscribe((usuarioActivo: any) => {
          Swal.fire(
            '¡Activado!',
            `El usuario ${usuario.primerNombre} ${usuario.segundoNombre} ${usuario.primerApellido} fue activado correctamente`,
            'success'
          );
          this.cargarUsuarios();
        });
      }
    });
  }

  actualizarUsuario(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${id}`);
    this.filterUsuarios(this._filterText);
  }

  crearUsuario() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${nuevo}`);
    this.filterUsuarios(this._filterText);
  }

  async buscarUsuario(id: number): Promise<UsuarioModel> {
    try {
      const respuesta: any = await this.usuarioService.getUsuario(id).toPromise();
      return respuesta.usuario;
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      throw error; // o manejar el error según tus necesidades
    }
  }

  toggleIcons(usuario: UsuariosPorCongregacionInterface) {
    this.selectedContact = this.selectedContact === usuario.id ? null : usuario.id;
  }

  exportExcel(): void {
    console.log(this.totalUsuarios);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.usuarios);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // crear fecha
    const format = 'dd/MM/yyyy';
    const myDate = new Date();
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    const filename = 'Censo ' + this.congregacion + formattedDate + '.xlsx';
    XLSX.writeFile(wb, filename);
  }

  filterUsuarios(filterTerm: string): UsuariosPorCongregacionInterface[] {
    filterTerm = filterTerm.toLocaleLowerCase();
    if (this.usuarios.length.toString() === '0' || this.filterText === '') {
      console.log(this.usuarios.length);
      return this.usuarios;
    } else {
      return this.usuarios.filter(
        (user: UsuariosPorCongregacionInterface) =>
          user.primerNombre.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          user.primerApellido.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          user.segundoApellido.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          user.email.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          user.congregacion.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          user.numeroCelular.indexOf(filterTerm) !== -1 ||
          user.id.toString().indexOf(filterTerm) !== -1
      );
    }
  }

  onTableDataChange(event: any) {
    this.pagina = event;
    this.cargarUsuarios();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.pagina = 1;
    this.cargarUsuarios();
  }
}
