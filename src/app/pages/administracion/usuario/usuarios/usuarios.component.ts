import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuariosPorCongregacionInterface } from 'src/app/core/interfaces/usuario.interface';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { EnviarCorreoService } from 'src/app/services/enviar-correo/enviar-correo.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { CargandoInformacionComponent } from '../../../../components/cargando-informacion/cargando-informacion.component';
import { VerCensoComponent } from '../../../../components/ver-censo/ver-censo.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,
  imports: [NgIf, CargandoInformacionComponent, VerCensoComponent],
})
export default class UsuariosComponent implements OnInit, OnDestroy {
  totalUsuarios: number = 0;
  usuarios: UsuariosPorCongregacionInterface[] = [];

  nombreArchivo: string;
  paginaDesde: number = 0;
  cargando: boolean = true;
  titulo: string = 'Feligreses en General';

  // Subscription
  usuarioSubscription: Subscription;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private enviarCorreoService: EnviarCorreoService
  ) {}

  ngOnInit(): void {
    this.nombreArchivo = 'Censo General';
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
        this.totalUsuarios = totalUsuarios;
        this.usuarios = usuarios;

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
    return usuario;
  }

  async activarUsuario(id: number) {
    const usuarioEncontrado: UsuarioModel = await this.buscarUsuario(id);

    await Swal.fire({
      title: 'Activar Congregación',
      text: `Esta seguro de activar el usuario ${usuarioEncontrado.primerNombre} ${usuarioEncontrado.segundoNombre} ${usuarioEncontrado.primerApellido}`,
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
            `El usuario ${usuarioEncontrado.primerNombre} ${usuarioEncontrado.segundoNombre} ${usuarioEncontrado.primerApellido} fue activado correctamente`,
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

  async enviarEmail(id: number) {
    await Swal.fire({
      title: 'Correo Electrónico',
      text: `Desea enviar el correo electrónico de bienvenida`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.enviarCorreoService.correoDeBienvenida(id).subscribe((resp: any) => {
          Swal.fire('¡Enviado!', `${resp.msg}`, 'success');
        });
      }
    });
  }
}
