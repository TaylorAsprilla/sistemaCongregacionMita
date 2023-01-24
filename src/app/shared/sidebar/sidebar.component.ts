import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROUTES, RUTAS } from 'src/app/routes/menu-items';
import { MultimediaCmarLiveModel } from 'src/app/core/models/acceso-multimedia.model';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  usuario: UsuarioModel;
  public usuarioMultimedia: MultimediaCmarLiveModel;

  public primerNombre: string = '';
  public segundoNombre: string = '';
  public primerApellido: string = '';
  public segundoApellido: string = '';
  public email: string = '';
  public numeroCelular: string = '';

  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[] = [];

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

  constructor(private modalService: NgbModal, private usuarioService: UsuarioService) {}
  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter((sidebarnavItem) => sidebarnavItem);

    console.log('this.sidebarnavItems', this.sidebarnavItems);

    this.usuario = this.usuarioService.usuario;
    this.usuarioMultimedia = this.usuarioService.usuarioMultimedia;

    this.primerNombre = this.usuario?.primerNombre ? this.usuario.primerNombre : this.usuarioMultimedia.nombre;
    this.segundoNombre = this.usuario?.segundoNombre ? this.usuario.segundoNombre : '';
    this.primerApellido = this.usuario?.primerApellido ? this.usuario.primerApellido : '';
    this.segundoApellido = this.usuario?.segundoApellido ? this.usuario.segundoApellido : '';
    this.email = this.usuario?.email ? this.usuario.email : '';
    this.numeroCelular = this.usuario?.numeroCelular ? this.usuario.numeroCelular : '';
  }

  logout() {
    this.usuarioService.logout();
  }
}
