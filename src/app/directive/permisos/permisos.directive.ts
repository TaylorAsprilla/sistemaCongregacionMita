import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListarUsuario } from 'src/app/core/interfaces/usuario.interface';
import { PermisoUsuarioModel } from 'src/app/core/models/permiso-usuario.model';
import { PermisoModel } from 'src/app/core/models/permisos.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

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
      console.log('Dataaa', data);
      this.permisoUsuario = data.permisos;
    });
    console.log('val', val);
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

    console.log('permisos', this.permisos);

    if (this.permisoUsuario) {
      for (const permiso of this.permisos) {
        const permisosUsuario = this.permisoUsuario.find(
          (permiso) => permiso.permiso.toUpperCase() === this.permisos.toString()
        );

        if (permisosUsuario) {
          tienePermiso = true;
          break;
        }
      }
    }
    return tienePermiso;
  }
}
