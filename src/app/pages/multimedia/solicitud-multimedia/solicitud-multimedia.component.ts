import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SolicitudMultimediaModel } from 'src/app/core/models/solicitud-multimedia';
import { Rutas } from 'src/app/routes/menu-items';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-multimedia',
  templateUrl: './solicitud-multimedia.component.html',
  styleUrls: ['./solicitud-multimedia.component.scss'],
})
export class SolicitudMultimediaComponent implements OnInit {
  solicitudesDeAccesos: SolicitudMultimediaModel[] = [];

  cargando: boolean = false;

  // Subscription
  public solicitudAccesoSubscription: Subscription;
  constructor(private router: Router, private accesoMultimediaServices: SolicitudMultimediaService) {}

  ngOnInit(): void {
    this.cargarSolicitudDeAccesos();
  }

  cargarSolicitudDeAccesos() {
    this.cargando = true;
    this.accesoMultimediaServices.getSolicitudes().subscribe((solicitudesDeAcceso) => {
      this.solicitudesDeAccesos = solicitudesDeAcceso.filter(
        (solicitud: SolicitudMultimediaModel) => solicitud.status === true
      );
      this.cargando = false;
    });
  }

  crearSolicitud() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.SOLICITUD_MULTIMEDIA}/${nuevo}`);
  }

  aceptarSolicitud() {
    Swal.fire('Solicitud Aprobada', 'La solicitud fue aprobada exitosamente', 'success');
  }

  deshabilitarSolicitud() {
    Swal.fire('Solicitud Deshabilitada', 'La solicitud se deshabilito exitosamente', 'success');
  }

  desAprobarSolicitud() {
    Swal.fire('No aprobado', 'La solicitud no se aprobó', 'success');
  }
}
