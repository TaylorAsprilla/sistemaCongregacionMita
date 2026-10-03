import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROUTES, ROLES, RUTAS } from 'src/app/routes/menu-items';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultimediaCongregacionModel } from 'src/app/core/models/acceso-multimedia.model';
import { GENERO } from 'src/app/core/enums/genero.enum';
import { configuracion } from 'src/environments/config/configuration';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { PermisosDirective } from '../../directive/permisos/permisos.directive';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { InformeService } from 'src/app/services/informe/informe.service';
import { obtenerFechasPeriodoInforme } from 'src/app/core/utils/periodo-informe';
import { RouteInfo } from 'src/app/core/interfaces/route-info.interfase';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterLink, PermisosDirective, NgClass, RouterLinkActive, NgScrollbarModule],
})
export class SidebarComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private usuarioService = inject(UsuarioService);
  private informeService = inject(InformeService);
  private modalService = inject(NgbModal);

  menuItems: any[] = [];
  usuario: UsuarioModel | undefined;
  multimediaCongregacion: MultimediaCongregacionModel | undefined;

  primerNombre: string | undefined = '';
  segundoNombre: string | undefined = '';
  primerApellido: string | undefined = '';
  segundoApellido: string | undefined = '';
  email: string | undefined = '';
  numeroCelular: string = '';
  nombre: string = '';

  fotoPerfil: string = '';

  showMenu = '';
  showSubMenu = '';
  sidebarnavItems: any[] = [];

  get Rutas() {
    return RUTAS;
  }

  get tieneInformeActivo(): boolean {
    return this.informeService.tieneInformeActivo;
  }

  contarSubmenuVisible(submenu: RouteInfo[] = []): number {
    return submenu.filter((item) => !item.requiresActiveReport || this.tieneInformeActivo).length;
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
      this.cargarInformeActivoParaMenu();

      const { primerNombre, segundoNombre, primerApellido, segundoApellido, email, numeroCelular, genero } =
        this.usuario;

      this.primerNombre = primerNombre;
      this.segundoNombre = segundoNombre;
      this.primerApellido = primerApellido;
      this.segundoApellido = segundoApellido;

      this.nombre = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`;
      this.email = email;
      this.numeroCelular = numeroCelular;

      this.fotoPerfil =
        genero?.genero === GENERO.MASCULINO ? configuracion.avatarMasculino : configuracion.avatarFemenino;
    } else if (this.usuarioService.nombreQR) {
      this.fotoPerfil = configuracion.logoMultimedia;
      this.nombre = this.usuarioService.nombreQR;
    } else if (this.multimediaCongregacion) {
      const { congregacion, email } = this.multimediaCongregacion;

      this.fotoPerfil = configuracion.logoMultimedia;

      this.nombre = congregacion;
      this.email = email;
    }
  }

  private cargarInformeActivoParaMenu(): void {
    const rolesConInforme = [
      ROLES.ADMINISTRADOR,
      ROLES.PRUEBA_INFORMES,
      ROLES.OBRERO_PAIS,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
    ];
    const tieneAccesoAInformes = this.usuario?.usuarioPermiso?.some(({ permiso }) =>
      rolesConInforme.some((rol) => rol === permiso),
    );

    if (!tieneAccesoAInformes) {
      return;
    }

    const { min, max } = obtenerFechasPeriodoInforme();
    this.informeService
      .cargarResumenInforme(this.usuarioService.usuarioId, min, max)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (error) => console.error('Error al verificar el informe activo para el menú:', error),
      });
  }

  logout() {
    this.usuarioService.logout();
  }
}
