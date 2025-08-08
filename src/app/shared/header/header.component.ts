import { NgbModal, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES, RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { MultimediaCongregacionModel } from 'src/app/core/models/acceso-multimedia.model';
import { GENERO } from 'src/app/core/enums/genero.enum';
import { FormsModule } from '@angular/forms';
import { configuracion } from 'src/environments/config/configuration';
import { PermisosDirective } from 'src/app/directive/permisos/permisos.directive';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [FormsModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, RouterLink, PermisosDirective],
})
export class HeaderComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  @Output() toggleSidebar = new EventEmitter<void>();

  usuario: UsuarioModel | undefined;
  multimediaCongregacion: MultimediaCongregacionModel | undefined;

  primerNombre: string = '';
  segundoNombre: string = '';
  primerApellido: string = '';
  segundoApellido: string = '';
  nombre: string = '';
  email: string | undefined = '';
  numeroCelular: string = '';

  isQrLogin: boolean = false;

  fotoPerfil: string = '';

  get Rutas() {
    return RUTAS;
  }

  get Roles() {
    return ROLES;
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.multimediaCongregacion = this.usuarioService.multimediaCongregacion;
    this.isQrLogin = this.usuarioService.isQRLogin;

    if (this.usuario) {
      const { primerNombre, segundoNombre, primerApellido, segundoApellido, email, numeroCelular, genero } =
        this.usuario;

      this.nombre = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`;
      this.email = email;
      this.numeroCelular = numeroCelular;

      this.fotoPerfil =
        genero?.genero === GENERO.MASCULINO ? configuracion.avatarMasculino : configuracion.avatarFemenino;
    } else if (this.usuarioService.nombreQR) {
      this.nombre = this.usuarioService.nombreQR;
      this.fotoPerfil = configuracion.logoMultimedia;
    } else if (this.multimediaCongregacion) {
      const { congregacion, email } = this.multimediaCongregacion;

      this.fotoPerfil = configuracion.logoMultimedia;
      this.nombre = congregacion;
      this.email = email;
    }
  }

  logout() {
    this.usuarioService.logout();
  }

  redirigirAInicio() {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
  }
}
