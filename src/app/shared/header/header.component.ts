import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { MultimediaCongregacionModel } from 'src/app/core/models/acceso-multimedia.model';
import { GENERO } from 'src/app/core/enums/genero.enum';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  usuario: UsuarioModel;
  multimediaCongregacion: MultimediaCongregacionModel;

  primerNombre: string = '';
  segundoNombre: string = '';
  primerApellido: string = '';
  segundoApellido: string = '';
  nombre: string = '';
  email: string = '';
  numeroCelular: string = '';

  fotoPerfil: string = '';

  get Rutas() {
    return RUTAS;
  }

  constructor(private usuarioService: UsuarioService, private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.multimediaCongregacion = this.usuarioService.multimediaCongregacion;

    if (this.usuario) {
      const { primerNombre, segundoNombre, primerApellido, segundoApellido, email, numeroCelular, genero } =
        this.usuario;

      this.nombre = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`;
      this.email = email;
      this.numeroCelular = numeroCelular;

      this.fotoPerfil =
        genero?.genero === GENERO.MASCULINO ? 'assets/images/users/perfil.png' : 'assets/images/users/perfil-mujer.png';
    } else if (this.multimediaCongregacion) {
      const { congregacion, email } = this.multimediaCongregacion;

      this.fotoPerfil = 'assets/images/users/multimedia.jpg';
      this.nombre = congregacion;
      this.email = email;
    }
  }

  ngAfterViewInit() {}

  logout() {
    this.usuarioService.logout();
  }

  redirigirAInicio() {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
  }
}
