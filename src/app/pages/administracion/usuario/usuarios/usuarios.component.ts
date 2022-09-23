import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { UsuarioCongregacionModel } from 'src/app/core/models/usuarioCongregacion.model';
import { Rutas } from 'src/app/routes/menu-items';
import { CampoService } from 'src/app/services/campo/campo.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  public totalUsuarios: number = 0;
  public usuarios: UsuarioModel[] = [];

  public usuariosTemporales: UsuarioModel[] = [];

  public paginaDesde: number = 0;
  public pagina: number = 1;
  public totalPaginas: number = 0;

  public cargando: boolean = true;

  // Subscription
  public usuarioSubscription: Subscription;
  public paisSubscription: Subscription;
  public congregacionSubscription: Subscription;
  public campoSubscription: Subscription;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private paisService: PaisService,
    private congregacion: CongregacionService,
    private campoServise: CampoService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.listarUsuarios(this.paginaDesde).subscribe(({ totalUsuarios, usuarios }) => {
      this.totalUsuarios = totalUsuarios;
      this.usuarios = usuarios;
      this.usuariosTemporales = usuarios;
      this.cargando = false;
      this.totalPaginas = Math.ceil(totalUsuarios / 30);
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

  borrarUsuario(usuario: UsuarioModel) {
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
        this.usuarioService.eliminarUsuario(usuario).subscribe((usuarioEliminado) => {
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

  activarUsuario(usuario: UsuarioModel) {
    Swal.fire({
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
        this.usuarioService.activarUsuario(usuario).subscribe((usuarioActivo: any) => {
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
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.USUARIOS}/${id}`);
  }

  crearUsuario() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.USUARIOS}/${nuevo}`);
  }

  congregacionUsuario(idUsuario: number) {
    let usuario: UsuarioCongregacionModel;
    let pais: PaisModel;
    let congregacion: CongregacionModel;
    let campo: CampoModel;

    console.log(idUsuario);

    // this.usuarioService.getUsuario(idUsuario).subscribe((usuarioEncontrado: UsuarioInterface) => {
    //   usuario = usuarioEncontrado.usuarioCongregacion;

    //   console.log(usuario);

    //   // pais = this.buscarPais(usuario?.pais_id);
    //   // console.info(pais);
    //   // debugger;
    //   // congregacion = this.buscarCongregacion(usuario.congregacion_id);
    //   // campo = this.buscarCampo(usuario.campo_id);
    // });

    // console.log(usuario, pais, campo);

    return { usuario, pais, campo };
  }

  buscarPais(idPais: number): PaisModel {
    let pais: PaisModel;
    this.paisService.getPais(idPais).subscribe((paisEncontrado) => {
      pais = paisEncontrado;
      console.log(pais);
    });
    return pais;
  }

  buscarCongregacion(idCongregacion: number): CongregacionModel {
    let congregacion: CongregacionModel;
    this.congregacion.getCongregacion(idCongregacion).subscribe((congregacionEncontrada) => {
      congregacion = congregacionEncontrada;
    });
    return congregacion;
  }

  buscarCampo(idCampo: number): CampoModel {
    let campo: CampoModel;
    this.campoServise.getCampo(idCampo).subscribe((campoEncontrado) => {
      campo = campoEncontrado;
    });
    return campo;
  }
}
