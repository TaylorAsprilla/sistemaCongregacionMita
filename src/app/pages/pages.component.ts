import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RUTAS } from '../routes/menu-items';
import { MultimediaCongregacionModel } from '../core/models/acceso-multimedia.model';
import { UsuarioService } from '../services/usuario/usuario.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  color = 'blue';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  showRtl = false;

  multimediaCongregacion: MultimediaCongregacionModel;

  public innerWidth: any;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate([RUTAS.INICIO]);
    }
    this.handleLayout();

    this.multimediaCongregacion = this.usuarioService.multimediaCongregacion;

    if (this.multimediaCongregacion) {
      this.showMinisidebar = !this.showMinisidebar;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.handleLayout();
  }

  toggleSidebar() {
    this.showMinisidebar = !this.showMinisidebar;
  }

  handleLayout() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.showMinisidebar = true;
    } else {
      this.showMinisidebar = false;
    }
  }
}
