import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { CargandoInformacionComponent } from 'src/app/components/cargando-informacion/cargando-informacion.component';
import { UsuarioSolicitudMultimediaModel } from 'src/app/core/models/usuario-solicitud.model';
import { SolicitudesMultimediaComponent } from '../../../../components/solicitudes-multimedia/solicitudes-multimedia.component';

@Component({
  selector: 'app-solicitudes-pendiente',
  standalone: true,
  imports: [CargandoInformacionComponent, SolicitudesMultimediaComponent],
  templateUrl: './solicitudes-pendiente.component.html',
  styleUrl: './solicitudes-pendiente.component.scss',
})
export class SolicitudesPendienteComponent {
  solicitudes: UsuarioSolicitudMultimediaModel[] = [];

  cargando: boolean = false;
  usuarioId: number;

  // Subscription
  solicitudMultimediaServiceSubscription: Subscription;

  constructor(private solicitudMultimediaService: SolicitudMultimediaService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioId = this.usuarioService.usuario.id;
    this.cargarTodasLasSolicitudesPendientes();
  }

  ngOnDestroy(): void {
    this.solicitudMultimediaServiceSubscription?.unsubscribe;
  }

  cargarTodasLasSolicitudesPendientes(): void {
    this.cargando = true;

    this.solicitudMultimediaServiceSubscription = this.solicitudMultimediaService
      .getSolicitudesPendientes(this.usuarioId)
      .subscribe({
        next: (data) => {
          this.solicitudes = data;
          this.cargando = false;
        },
        error: (error) => {
          this.handleError(error);
          this.cargando = false;
        },
      });
  }

  handleError(error: any) {
    console.error(error);
    Swal.fire({
      title: 'Error',
      icon: 'error',
      html: `Ocurrió un error al cargar las solicitudes de acceso a CMAR LIVE. <br> ${error.error.msg}`,
    });
  }
}
