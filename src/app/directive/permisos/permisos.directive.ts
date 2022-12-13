import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PermisoModel } from 'src/app/core/models/permisos.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES } from 'src/app/routes/menu-items';

@Directive({
  selector: '[appPermisos]',
})
export class PermisosDirective {
  private usuarios: UsuarioModel[] = [];
  private permisoUsuario: PermisoModel[] = [];
  private permisos = [];
  private usuario: UsuarioModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {}

  @Input()
  set appPermisos(val: Array<string>) {
    this.activatedRoute.data.subscribe((data: { permisos: PermisoModel[] }) => {
      this.permisoUsuario = data.permisos;
    });

    this.permisos = val;
    this.actualizarVista();
  }

  private actualizarVista(): void {
    this.viewContainer.clear();
    if (this.validarPermisos()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private validarPermisos(): boolean {
    let tienePermiso = false;

    if (this.permisoUsuario) {
      for (const permiso of this.permisos) {
        //TODO Todos los usuarios tienen permiso para la sección de Multimedia
        if (permiso === ROLES.MULTIMEDIA) {
          tienePermiso = true;
          break;
        }
        const permisosUsuario = this.permisoUsuario.find(
          (permiso) => permiso.permiso.toUpperCase() === this.permisos.toString()
        );
        const permisos = permisosUsuario;

        if (permisos) {
          tienePermiso = true;
          break;
        }
      }
    }
    return tienePermiso;
  }
}
