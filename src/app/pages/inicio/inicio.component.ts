import { LinkEventoModel, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { generarSeccionHome, SeccionHome } from 'src/app/core/interfaces/seccion-home.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  totalUsuarios: number;

  paises: CongregacionPaisModel[] = [];
  congregaciones: CongregacionModel[] = [];
  campos: CampoModel[] = [];
  linkEventos: LinkEventoModel[] = [];
  servicios: LinkEventoModel[] = [];

  roles: ROLES[] = [];

  public generarSeccionHome: any[] = [];

  usuariosSubscription: Subscription;
  linEventosSubscription: Subscription;

  get ROLES() {
    return ROLES;
  }

  get TIPOEVENTO_ID() {
    return TIPOEVENTO_ID;
  }

  constructor(
    private usuarioServices: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private linkEventosService: LinkEventosService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data: { congregacion: CongregacionModel[]; pais: CongregacionPaisModel[]; campo: CampoModel[] }) => {
        this.paises = data.pais;
        this.congregaciones = data.congregacion;
        this.campos = data.campo;
      }
    );

    this.usuariosSubscription = this.usuarioServices.listarUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.totalUsuarios = totalUsuarios;
      this.usuarios = usuarios;
    });

    this.linEventosSubscription = this.linkEventosService.getEventos().subscribe((eventos: LinkEventoModel[]) => {
      this.linkEventos = eventos;
      this.servicios = this.linkEventos
        .filter((eventos) => eventos.tipoEvento_id === TIPOEVENTO_ID.SERVICIO)
        .slice(0, 1);
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
    this.usuariosSubscription?.unsubscribe();
    this.linEventosSubscription?.unsubscribe();
  }
}
