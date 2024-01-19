import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-censo',
  templateUrl: './censo.component.html',
  styleUrls: ['./censo.component.scss'],
})
export class CensoComponent implements OnInit {
  totalUsuarios: number = 0;
  usuarios: UsuarioModel[] = [];
  usuario: UsuarioModel;

  usuariosTemporales: UsuarioModel[] = [];
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

  constructor(private router: Router, private usuarioService: UsuarioService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;

    console.log(this.usuario);

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
    console.log('Entrandooo....');
    this.cargando = true;
    this.usuarioSubscription = this.usuarioService
      .listarUsuariosPorCongregacion(5, this.paginaDesde)
      .subscribe(({ totalUsuarios, usuarios }) => {
        this.totalUsuarios = totalUsuarios;
        this.usuarios = usuarios;
        this.usuariosTemporales = usuarios;
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

  toggleIcons(usuario: UsuarioModel) {
    this.selectedContact = this.selectedContact === usuario.id ? null : usuario.id;
  }
}
