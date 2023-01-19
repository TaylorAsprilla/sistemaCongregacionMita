import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { RazonSolicitudService } from 'src/app/services/razon-solicitud/razon-solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-razon-de-solicitud',
  templateUrl: './razon-de-solicitud.component.html',
  styleUrls: ['./razon-de-solicitud.component.scss'],
})
export class RazonDeSolicitudComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public razonSolicitudes: RazonSolicitudModel[] = [];

  public razonSolicitudSubscription: Subscription;

  constructor(
    private router: Router,
    private razonSolicitudService: RazonSolicitudService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarRazonSolicitud();
  }

  ngOnDestroy(): void {
    this.razonSolicitudSubscription?.unsubscribe();
  }

  cargarRazonSolicitud() {
    this.cargando = true;
    this.razonSolicitudSubscription = this.razonSolicitudService
      .getRazonsolicitud()
      .pipe(delay(100))
      .subscribe((razonSolicitud: RazonSolicitudModel[]) => {
        this.razonSolicitudes = razonSolicitud;
        this.cargando = false;
      });
  }

  actualizarRazonSolicitud(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.RAZON_DE_SOLICITUD}/${id}`);
  }

  borrarRazonSolicitud(razonSolicitud: RazonSolicitudModel) {
    Swal.fire({
      title: '¿Borrar Género?',
      text: `Esta seguro de borrar ${razonSolicitud.solicitud}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.razonSolicitudService
          .elimiminarRazonsolicitud(razonSolicitud)
          .subscribe((razonSolicitudEliminado: RazonSolicitudModel) => {
            Swal.fire('¡Deshabilitado!', ` ${razonSolicitud.solicitud} fue deshabilitada correctamente`, 'success');

            this.cargarRazonSolicitud();
          });
      }
    });
  }

  activarRazonSolicitud(razonSolicitud: RazonSolicitudModel) {
    Swal.fire({
      title: 'Activar Opción',
      text: `Esta seguro de activar el género ${razonSolicitud.solicitud}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.razonSolicitudService
          .actualizarRazonSolicitud(razonSolicitud)
          .subscribe((razonSolicitudActivo: RazonSolicitudModel) => {
            Swal.fire('¡Activado!', `${razonSolicitud.solicitud} fue activado correctamente`, 'success');
            console.log(this.razonSolicitudes[0]);
            this.cargarRazonSolicitud();
          });
      }
    });
  }
}
