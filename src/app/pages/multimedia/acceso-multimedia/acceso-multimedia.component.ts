import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccesoMultimediaModel } from 'src/app/models/acceso-multimedia.model';
import { Rutas } from 'src/app/routes/menu-items';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';

@Component({
  selector: 'app-acceso-multimedia',
  templateUrl: './acceso-multimedia.component.html',
  styleUrls: ['./acceso-multimedia.component.scss'],
})
export class AccesoMultimediaComponent implements OnInit {
  solicitudesDeAccesos: AccesoMultimediaModel[] = [];

  cargando: boolean = false;

  // Subscription
  public solicitudAccesoSubscription: Subscription;
  constructor(private router: Router, private accesoMultimediaServices: AccesoMultimediaService) {}

  ngOnInit(): void {
    this.cargarSolicitudDeAccesos();
  }

  cargarSolicitudDeAccesos() {
    this.cargando = true;
    this.accesoMultimediaServices.getAccesosMultimedia().subscribe((solicitudesDeAcceso) => {
      this.solicitudesDeAccesos = solicitudesDeAcceso;
      this.cargando = false;
    });
  }

  crearSolicitud() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CREAR_SOLICITUD_MULTIMEDIA}/${nuevo}`);
  }
}
