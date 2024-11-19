import { Component, HostListener } from '@angular/core';
import { MultimediaCongregacionModel } from './core/models/acceso-multimedia.model';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario/usuario.service';
import { RUTAS } from './routes/menu-items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sistemacmi';

  color = 'blue';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  showRtl = false;

  multimediaCongregacion: MultimediaCongregacionModel | undefined = undefined;

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
