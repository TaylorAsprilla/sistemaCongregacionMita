import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RUTAS } from '../routes/menu-items';
import { MultimediaCongregacionModel } from '../core/models/acceso-multimedia.model';
import { UsuarioService } from '../services/usuario/usuario.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { NgClass } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { BredcrumbsComponent } from '../shared/bredcrumbs/bredcrumbs.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FotoPerfilDialogoComponent } from '../shared/foto-perfil-dialogo/foto-perfil-dialogo.component';
import { FotoPerfilAvisoService } from '../core/services/foto-perfil-aviso.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  standalone: true,
  imports: [
    SpinnerComponent,
    NgClass,
    HeaderComponent,
    SidebarComponent,
    BredcrumbsComponent,
    RouterOutlet,
    FooterComponent,
    FotoPerfilDialogoComponent,
  ],
})
export class PagesComponent implements OnInit {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private avisoFoto = inject(FotoPerfilAvisoService);

  /** Solo los usuarios con cuenta propia administran su fotografía (no QR ni multimedia). */
  get esUsuario(): boolean {
    return !!this.usuarioService.usuario && !this.usuarioService.isQRLogin;
  }

  color = 'blue';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  showRtl = false;

  multimediaCongregacion: MultimediaCongregacionModel | undefined = undefined;

  public innerWidth: any;

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate([RUTAS.INICIO]);
    }
    this.handleLayout();

    this.multimediaCongregacion = this.usuarioService.multimediaCongregacion;

    if (this.multimediaCongregacion) {
      this.showMinisidebar = !this.showMinisidebar;
    }

    if (this.usuarioService.isQRLogin) {
      this.showMinisidebar = !this.showMinisidebar;
    }

    // Invitación de bienvenida (una sola vez); se espera un momento para no chocar con otros avisos al ingresar.
    if (this.esUsuario) {
      setTimeout(() => this.avisoFoto.mostrarSiCorresponde(), 2000);
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
