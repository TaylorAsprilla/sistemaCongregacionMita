import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, ModalDismissReasons, NgbPanelChangeEvent, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MultimediaCmarLiveModel } from 'src/app/core/models/acceso-multimedia.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public usuario: UsuarioModel;
  public usuarioMultimedia: MultimediaCmarLiveModel;
  public config: PerfectScrollbarConfigInterface = {};
  public primerNombre: string = '';
  public segundoNombre: string = '';
  public primerApellido: string = '';
  public segundoApellido: string = '';
  public email: string = '';
  public numeroCelular: string = '';

  get Rutas() {
    return RUTAS;
  }

  constructor(private modalService: NgbModal, private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.usuarioMultimedia = this.usuarioService.usuarioMultimedia;

    this.primerNombre = this.usuario?.primerNombre ? this.usuario.primerNombre : this.usuarioMultimedia.nombre;
    this.segundoNombre = this.usuario?.segundoNombre ? this.usuario.segundoNombre : '';
    this.primerApellido = this.usuario?.primerApellido ? this.usuario.primerApellido : '';
    this.segundoApellido = this.usuario?.segundoApellido ? this.usuario.segundoApellido : '';
    this.email = this.usuario?.email ? this.usuario.email : this.usuarioMultimedia.email;
    this.numeroCelular = this.usuario?.numeroCelular ? this.usuario.numeroCelular : this.usuarioMultimedia.celular;
  }

  ngAfterViewInit() {}

  logout() {
    this.usuarioService.logout();
  }
}
