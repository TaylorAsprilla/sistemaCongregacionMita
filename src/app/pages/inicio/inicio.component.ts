import { LinkEventoModel, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { generarSeccionHome, SeccionHomeInterface } from 'src/app/core/interfaces/seccion-home.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES } from 'src/app/routes/menu-items';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';
import { NgFor } from '@angular/common';
import { PermisosDirective } from '../../directive/permisos/permisos.directive';
import { SeccionHomeComponent } from '../../components/seccion-home/seccion-home.component';
import { ServiciosEnVivoComponent } from '../../components/servicios-en-vivo/servicios-en-vivo.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [NgFor, PermisosDirective, SeccionHomeComponent, ServiciosEnVivoComponent],
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
  linEventosSubscription: Subscription;

  get ROLES() {
    return ROLES;
  }

  get TIPOEVENTO_ID() {
    return TIPOEVENTO_ID;
  }

  constructor(private activatedRoute: ActivatedRoute, private linkEventosService: LinkEventosService) {}

  ngOnInit(): void {
    this.linEventosSubscription = this.linkEventosService.getLinkServicio().subscribe((evento: LinkEventoModel) => {
      this.servicio = evento;
    });

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

  ngOnDestroy(): void {
    this.linEventosSubscription?.unsubscribe();
  }
}
