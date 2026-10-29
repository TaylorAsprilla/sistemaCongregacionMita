import { Component, Input } from '@angular/core';
import { PermisoModel } from 'src/app/core/models/permisos.model';
import { ROLES } from 'src/app/routes/menu-items';

const ROLES_PRIORIZADOS = [
  { rol: ROLES.ADMINISTRADOR, etiqueta: 'Administrador' },
  { rol: ROLES.ADMINISTRADOR_PAIS, etiqueta: 'Administrador país' },
  { rol: ROLES.SUPERVISOR, etiqueta: 'Supervisor' },
  { rol: ROLES.SUPERVISOR_LOCAL, etiqueta: 'Supervisor local' },
  { rol: ROLES.OBRERO_PAIS, etiqueta: 'Obrero país' },
  { rol: ROLES.OBRERO_CIUDAD, etiqueta: 'Obrero ciudad' },
  { rol: ROLES.OBRERO_CAMPO, etiqueta: 'Obrero campo' },
  { rol: ROLES.ASISTENTE_OOTS, etiqueta: 'Asistente OOTS' },
  { rol: ROLES.APROBADOR_MULTIMEDIA, etiqueta: 'Aprobador multimedia' },
  { rol: ROLES.ADMINISTRADOR_MULTIMEDIA, etiqueta: 'Administrador multimedia' },
  { rol: ROLES.COMITE_RECTOR, etiqueta: 'Comité rector' },
  { rol: ROLES.AYUDANTE, etiqueta: 'Ayudante' },
  { rol: ROLES.MULTIMEDIA, etiqueta: 'Multimedia' },
  { rol: ROLES.USUARIO, etiqueta: 'Usuario' },
  { rol: ROLES.PRUEBA_INFORMES, etiqueta: 'Prueba informes' },
];

const normalizarRol = (rol: string): string =>
  rol.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();

@Component({
  selector: 'app-rol-usuario',
  standalone: true,
  template: `
    @if (rolPrincipal; as rol) {
      <span class="rol-usuario" [attr.aria-label]="'Rol principal: ' + rol">
        <i class="fa fa-id-badge" aria-hidden="true"></i>
        {{ rol }}
      </span>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .rol-usuario {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      max-width: 100%;
      margin: 0.15rem 0 0.65rem;
      padding: 0.3rem 0.65rem;
      border: 1px solid #c5d9ed;
      border-radius: 1rem;
      background: #edf4fc;
      color: #245580;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.4;
      text-align: left;
      overflow-wrap: anywhere;
    }
  `,
})
export class RolUsuarioComponent {
  @Input() permisos: readonly Pick<PermisoModel, 'permiso'>[] | null | undefined;

  get rolPrincipal(): string | undefined {
    const roles = new Set(this.permisos?.map(({ permiso }) => normalizarRol(permiso)));
    return ROLES_PRIORIZADOS.find(({ rol }) => roles.has(normalizarRol(rol)))?.etiqueta;
  }
}
