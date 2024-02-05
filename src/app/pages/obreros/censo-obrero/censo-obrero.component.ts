import Swal from 'sweetalert2';
import { UsuariosPorCongregacionInterface } from './../../../core/interfaces/usuario.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UsuariosPorCongregacionService } from 'src/app/services/usuarios-por-congregacion/usuarios-por-congregacion.service';

@Component({
  selector: 'app-censo-obrero',
  templateUrl: './censo-obrero.component.html',
  styleUrls: ['./censo-obrero.component.scss'],
})
export class CensoObreroComponent implements OnInit, OnDestroy {
  totalUsuarios: number = 0;
  usuarios: UsuariosPorCongregacionInterface[] = [];

  idCongregacionObrero: number;

  paginaDesde: number = 0;
  pagina: number = 1;
  totalPaginas: number = 0;

  showIcons: boolean = false;
  selectedContact: number;

  congregacion: string;

  cargando: boolean = true;

  // Subscription
  usuarioSubscription: Subscription;

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
        this.cargando = false;
        this.totalPaginas = Math.ceil(totalUsuarios / 50);
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
}
