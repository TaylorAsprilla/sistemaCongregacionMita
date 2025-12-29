import Swal from 'sweetalert2';
import { UsuariosPorCongregacionInterface } from './../../../core/interfaces/usuario.interface';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UsuariosPorCongregacionService } from 'src/app/services/usuarios-por-congregacion/usuarios-por-congregacion.service';
import { EnviarCorreoService } from 'src/app/services/enviar-correo/enviar-correo.service';

import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';
import { VerCensoComponent } from '../../../components/ver-censo/ver-censo.component';

@Component({
  selector: 'app-censo-obrero',
  templateUrl: './censo-obrero.component.html',
  styleUrls: ['./censo-obrero.component.scss'],
  standalone: true,
  imports: [CargandoInformacionComponent, VerCensoComponent],
})
export default class CensoObreroComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private usuariosPorCongregacionService = inject(UsuariosPorCongregacionService);
  private enviarCorreoService = inject(EnviarCorreoService);

  totalUsuarios: number = 0;
  usuarios: UsuariosPorCongregacionInterface[] = [];

  idUsuario: number | undefined;

  paginaDesde: number = 0;
  congregacion: string | undefined;
  nombreArchivo: string;

  cargando: boolean = true;

  // Subscription
  usuarioSubscription: Subscription;

  ngOnInit(): void {
    this.idUsuario = this.usuarioService.usuarioId;
    this.congregacion = this.usuarioService.nombreCongregacion;
    this.nombreArchivo = `Censo`;
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioSubscription = this.usuariosPorCongregacionService
      .listarUsuariosPorCongregacion(this.idUsuario)
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

  async activarUsuario(usuarioId: number) {
    const usuarioEncontrado: UsuarioModel = await this.buscarUsuario(usuarioId);

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

  realizarTransferencia(data: { pais: number; congregacion: number; campo: number; id: number }) {
    this.usuarioService
      .transferirUsuario(
        {
          pais_id: data.pais,
          congregacion_id: data.congregacion,
          campo_id: data.campo,
        },
        data.id
      )
      .subscribe({
        next: () => {
          Swal.fire('Éxito', 'La transferencia se realizó con éxito', 'success');
          this.cargarUsuarios();
        },
        error: (error) => {
          const errores = error.error.errors;
          const listaErrores = Object.entries(errores)
            .map(([key, value]) => `° ${value['msg']}<br>`)
            .join('');
          Swal.fire('Error', `Error al transferir: <p>${listaErrores}</p>`, 'error');
        },
      });
  }

  actualizarUsuario(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${id}`);
  }

  transcenderUsuario(id: number) {
    if (id === this.usuarioService.usuarioId) {
      return Swal.fire({
        title: 'Acción no permitida',
        text: 'No puede marcarse a sí mismo como transcendido.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d33',
      });
    }

    this.usuarioService.transcenderUsuario(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Feligres Transcendido',
          text: 'El feligrés ha sido marcado como transcendido exitosamente.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
        });
        this.cargarUsuarios();
      },
      error: (error) => {
        const errores = error.error.errors;
        const listaErrores = Object.entries(errores)
          .map(([key, value]) => `° ${value['msg']}<br>`)
          .join('');
        Swal.fire({
          title: 'Error al Transcender',
          html: `Hubo un error al marcar al feligrés como transcendido: <p>${listaErrores}</p>`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33',
        });
      },
    });
    return id;
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
      text: `Desea enviar correo electrónico de bienvenida`,
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
