import Swal from 'sweetalert2';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { UsuarioSolicitudMultimediaModel } from 'src/app/core/models/usuario-solicitud.model';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { CargandoInformacionComponent } from 'src/app/components/cargando-informacion/cargando-informacion.component';
import { SolicitudesMultimediaComponent } from '../../../../components/solicitudes-multimedia/solicitudes-multimedia.component';

@Component({
  selector: 'app-solicitud-multimedia',
  templateUrl: './solicitud-multimedia.component.html',
  styleUrls: ['./solicitud-multimedia.component.scss'],
  standalone: true,
  imports: [CargandoInformacionComponent, SolicitudesMultimediaComponent],
})
export class SolicitudMultimediaComponent implements OnInit, OnDestroy {
  solicitudes: UsuarioSolicitudMultimediaModel[] = [];
  cargando = false;
  usuarioId: number;

  // Subscription
  public solicitudAccesoSubscription: Subscription;
  public solicitudMultimediaServiceSubscription: Subscription;

  constructor(private solicitudMultimediaService: SolicitudMultimediaService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioId = this.usuarioService.usuario.id;

    this.cargarTodasLasSolicitudes();
  }

  ngOnDestroy(): void {
    this.solicitudAccesoSubscription?.unsubscribe();
    this.solicitudMultimediaServiceSubscription?.unsubscribe();
  }

  cargarTodasLasSolicitudes(): void {
    this.cargando = true;

    this.solicitudMultimediaServiceSubscription = this.solicitudMultimediaService.getSolicitudes().subscribe({
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
