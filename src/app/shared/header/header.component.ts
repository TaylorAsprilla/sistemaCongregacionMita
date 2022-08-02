import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, ModalDismissReasons, NgbPanelChangeEvent, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Rutas } from 'src/app/routes/menu-items';
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
  public config: PerfectScrollbarConfigInterface = {};

  get Rutas() {
    return Rutas;
  }

  constructor(private modalService: NgbModal, private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
  }

  ngAfterViewInit() {}

  logout() {
    this.usuarioService.logout();
  }
}
