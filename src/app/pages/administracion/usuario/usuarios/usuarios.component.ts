import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuariosPorCongregacionInterface } from 'src/app/core/interfaces/usuario.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  totalUsuarios: number = 0;
  usuarios: UsuariosPorCongregacionInterface[] = [];

  campos: CampoModel[] = [];
  paises: CongregacionPaisModel[] = [];

  paginaDesde: number = 0;
  pagina: number = 1;
  totalPaginas: number = 0;

  cargando: boolean = true;
  showIcons: boolean = false;
  selectedContact: number;

  // Subscription
  usuarioSubscription: Subscription;

  filtrarTexto: string = '';
  usuariosFiltrados: UsuariosPorCongregacionInterface[] = [];
  tableSize: number = 50;

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    this.usuariosFiltrados = this.filterUsuarios(value);
    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  constructor(private router: Router, private usuarioService: UsuarioService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { pais: CongregacionPaisModel[]; campo: CampoModel[] }) => {
      this.paises = data.pais.filter((pais) => pais.estado === true);
      this.campos = data.campo.filter((campo) => campo.estado === true);
    });
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioSubscription = this.usuarioService
      .listarUsuarios(this.paginaDesde)
      .subscribe(({ totalUsuarios, usuarios }) => {
        this.totalUsuarios = usuarios.length;
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number, numeroPagina: number) {
    this.paginaDesde += valor;
    this.pagina += numeroPagina;

    if (this.paginaDesde < 0) {
      this.pagina = 1;
      this.paginaDesde = 0;
    } else if (this.paginaDesde >= this.totalUsuarios) {
      this.pagina += numeroPagina;
      this.paginaDesde -= valor;
    }

    this.cargarUsuarios();
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
  }

  crearUsuario() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${nuevo}`);
  }

  buscarPais(idPais: number): string {
    return this.paises.find((pais) => pais.id === idPais)?.pais;
  }

  buscarCampo(idCampo: number): string {
    return this.campos.find((campo) => campo.id === idCampo)?.campo;
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.usuarios);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Censo Total');
    // crear fecha
    const format = 'dd/MM/yyyy';
    const myDate = new Date();
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    const filename = 'Censo Total ' + formattedDate + '.xlsx';
    XLSX.writeFile(wb, filename);
  }

  filterUsuarios(filterTerm: string): UsuariosPorCongregacionInterface[] {
    filterTerm = filterTerm.toLocaleLowerCase();
    if (this.usuarios.length.toString() === '0' || this.filterText === '') {
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

  // pasar pagina
  onTableDataChange(event: any) {
    this.pagina = event;
  }
}
