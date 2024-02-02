import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROUTES, RUTAS } from 'src/app/routes/menu-items';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultimediaCongregacionModel } from 'src/app/core/models/acceso-multimedia.model';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  usuario: UsuarioModel;
  multimediaCongregacion: MultimediaCongregacionModel;

  primerNombre: string = '';
  segundoNombre: string = '';
  primerApellido: string = '';
  segundoApellido: string = '';
  email: string = '';
  numeroCelular: string = '';

  showMenu = '';
  showSubMenu = '';
  sidebarnavItems: any[] = [];

  get Rutas() {
    return RUTAS;
  }

  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  constructor(private usuarioService: UsuarioService, private modalService: NgbModal) {}
  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter((sidebarnavItem) => sidebarnavItem);

    this.sidebarnavItems
      .filter((item) => item.submenu.length > 0)
      .forEach((item) => {
        item.submenu.sort((a: any, b: any) => (a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1));
      });

    this.usuario = this.usuarioService.usuario;
    this.multimediaCongregacion = this.usuarioService.multimediaCongregacion;

    if (this.usuario) {
      this.primerNombre = this.usuario?.primerNombre;
      this.segundoNombre = this.usuario?.segundoNombre;
      this.primerApellido = this.usuario?.primerApellido;
      this.segundoApellido = this.usuario?.segundoApellido;
      this.email = this.usuario?.email;
      this.numeroCelular = this.usuario?.numeroCelular;
    } else if (this.multimediaCongregacion) {
      this.primerNombre = this.multimediaCongregacion.congregacion;
      this.email = this.multimediaCongregacion?.email;
    }
  }

  logout() {
    this.usuarioService.logout();
  }
}
