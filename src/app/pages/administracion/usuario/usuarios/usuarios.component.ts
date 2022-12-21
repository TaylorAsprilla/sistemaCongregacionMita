import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampoModel } from 'src/app/core/models/campo.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { Rutas } from 'src/app/routes/menu-items';
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
  public campos: CampoModel[] = [];
  public paises: PaisModel[] = [];

  public paginaDesde: number = 0;
  public pagina: number = 1;
  public totalPaginas: number = 0;

  public cargando: boolean = true;

  // Subscription
  public usuarioSubscription: Subscription;
  public paisSubscription: Subscription;
  public congregacionSubscription: Subscription;
  public campoSubscription: Subscription;

  constructor(private router: Router, private usuarioService: UsuarioService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { pais: PaisModel[]; campo: CampoModel[] }) => {
      this.paises = data.pais.filter((pais) => pais.estado === true);
      this.campos = data.campo.filter((campo) => campo.estado === true);
    });
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.listarUsuarios(this.paginaDesde).subscribe(({ totalUsuarios, usuarios }) => {
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
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.USUARIOS}/${id}`);
  }

  crearUsuario() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.USUARIOS}/${nuevo}`);
  }

  buscarPais(idPais: number): string {
    return this.paises.find((pais) => pais.id === idPais)?.pais;
  }

  buscarCampo(idCampo: number): string {
    return this.campos.find((campo) => campo.id === idCampo)?.campo;
  }
}
