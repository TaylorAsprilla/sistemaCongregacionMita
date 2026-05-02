import { LinkEventoModel } from 'src/app/core/models/link-evento.model';
import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { generarSeccionHome, SeccionHomeInterface } from 'src/app/core/interfaces/seccion-home.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES } from 'src/app/routes/menu-items';

import { PermisosDirective } from '../../directive/permisos/permisos.directive';
import { SeccionHomeComponent } from '../../components/seccion-home/seccion-home.component';
import { ServiciosEnVivoComponent } from '../../components/servicios-en-vivo/servicios-en-vivo.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [PermisosDirective, SeccionHomeComponent, ServiciosEnVivoComponent],
})
export default class InicioComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  totalUsuarios: number;

  paises: CongregacionPaisModel[] = [];
  congregaciones: CongregacionModel[] = [];
  campos: CampoModel[] = [];
  servicio: LinkEventoModel;

  roles: ROLES[] = [];

  public generarSeccionHome: SeccionHomeInterface[] = [];

  usuariosSubscription: Subscription;

  get ROLES() {
    return ROLES;
  }

  ngOnInit(): void {
    this.generarSeccionHome = generarSeccionHome.filter((seccionInforme) => seccionInforme);

    this.roles = [
      ROLES.ADMINISTRADOR,
      ROLES.SUPERVISOR,
      ROLES.SUPERVISOR_LOCAL,
      ROLES.OBRERO_CIUDAD,
      ROLES.OBRERO_CAMPO,
      ROLES.ASISTENTE_OOTS,
    ];
  }
}
