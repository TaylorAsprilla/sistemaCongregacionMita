import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccesoMultimediaModel } from 'src/app/core/models/acceso-multimedia.model';
import { PermisoModel } from 'src/app/core/models/permisos.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Directive({
  selector: '[appPermisos]',
})
export class PermisosDirective {
  private permisos = [];
  private usuario: UsuarioModel;
  private usuarioMultimedia: AccesoMultimediaModel;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private usuarioServices: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioServices.usuario;
    this.usuarioMultimedia = this.usuarioServices.usuarioMultimedia;

    this.actualizarVista();
  }

  @Input()
  set appPermisos(val: Array<string>) {
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

    if (this.usuario || this.usuarioMultimedia) {
      for (let [index, permiso] of this.permisos.entries()) {
        //TODO Solo tienen permiso Multimedia los que solicitaron acceso a CMAR.live
        if (!this.usuario?.usuarioPermiso && permiso === ROLES.MULTIMEDIA) {
          tienePermiso = true;
          break;
        } else {
          const permisosUsuario = this.usuario?.usuarioPermiso.find(
            (permisosUsuario: PermisoModel) => permisosUsuario.permiso.toUpperCase() === this.permisos[index].toString()
          );

          if (permisosUsuario) {
            tienePermiso = true;
            break;
          }
        }
      }
    }
    return tienePermiso;
  }
}
