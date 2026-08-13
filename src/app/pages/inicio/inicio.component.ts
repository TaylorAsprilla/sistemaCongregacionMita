import { LinkEventoModel } from 'src/app/core/models/link-evento.model';
import { Component, OnInit, inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { generarSeccionHome, SeccionHomeInterface } from 'src/app/core/interfaces/seccion-home.interface';
import { MensajeInformativo } from 'src/app/core/interfaces/mensaje-informativo.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES } from 'src/app/routes/menu-items';
import { MensajesInformativosService } from 'src/app/services/mensajes-informativos/mensajes-informativos.service';

import { PermisosDirective } from '../../directive/permisos/permisos.directive';
import { SeccionHomeComponent } from '../../components/seccion-home/seccion-home.component';
import { ServiciosEnVivoComponent } from '../../components/servicios-en-vivo/servicios-en-vivo.component';
import { MensajesInformativosBannerComponent } from '../../components/mensajes-informativos-banner/mensajes-informativos-banner.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [PermisosDirective, SeccionHomeComponent, ServiciosEnVivoComponent, MensajesInformativosBannerComponent],
})
export default class InicioComponent implements OnInit {
  private mensajesInformativosService = inject(MensajesInformativosService);

  usuarios: UsuarioModel[] = [];
  totalUsuarios: number;

  paises: CongregacionPaisModel[] = [];
  congregaciones: CongregacionModel[] = [];
  campos: CampoModel[] = [];
  servicio: LinkEventoModel;

  roles: ROLES[] = [];

  public generarSeccionHome: SeccionHomeInterface[] = [];

  mensajesInformativosActivos: MensajeInformativo[] = [];

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

    this.cargarMensajesInformativos();
  }

  cargarMensajesInformativos(): void {
    this.mensajesInformativosService.obtenerActivos().subscribe({
      next: (response) => {
        this.mensajesInformativosActivos = response.mensajesActivos || [];
      },
      // Si el backend falla, el Home debe seguir funcionando con normalidad
      error: () => {
        this.mensajesInformativosActivos = [];
      },
    });
  }
}
