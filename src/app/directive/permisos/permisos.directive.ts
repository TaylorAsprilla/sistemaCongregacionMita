import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { MultimediaCongregacionModel } from 'src/app/core/models/acceso-multimedia.model';
import { PermisoModel } from 'src/app/core/models/permisos.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Directive({
  selector: '[appPermisos]',
  standalone: true,
})
export class PermisosDirective implements OnInit {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private usuarioServices = inject(UsuarioService);

  private permisos = [];
  private usuario: UsuarioModel;
  private multimediaCongregacion: MultimediaCongregacionModel;

  ngOnInit(): void {
    this.usuario = this.usuarioServices.usuario;
    this.multimediaCongregacion = this.usuarioServices.multimediaCongregacion;

    this.actualizarVista();
  }

  @Input()
  set appPermisos(val: Array<string>) {
    this.permisos = val;

    this.actualizarVista();
  }

  private actualizarVista(): void {
    const tienePermiso = this.validarPermisos();

    this.viewContainer.clear();
    if (tienePermiso) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private validarPermisos(): boolean {
    let tienePermiso = false;

    if (this.usuario || this.multimediaCongregacion) {
      for (let [index, permiso] of this.permisos.entries()) {
        //TODO Solo tienen permiso Multimedia los que solicitaron acceso a CMAR.live
        if (!this.usuario?.usuarioPermiso && permiso === ROLES.MULTIMEDIA) {
          tienePermiso = true;

          break;
        } else {
          // Normalizar ambos strings: uppercase y trim
          const permisoNormalizado = permiso.toUpperCase().trim();

          const permisosUsuario = this.usuario?.usuarioPermiso.find((permisosUsuario: PermisoModel) => {
            const permisoUsuarioNormalizado = permisosUsuario.permiso.toUpperCase().trim();

            return permisoUsuarioNormalizado === permisoNormalizado;
          });

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
