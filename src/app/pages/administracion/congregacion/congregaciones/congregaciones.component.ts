import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CongregacionModel } from 'src/app/models/congregacion.model';
import { Rutas } from 'src/app/routes/menu-items';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-congregaciones',
  templateUrl: './congregaciones.component.html',
  styleUrls: ['./congregaciones.component.css'],
})
export class CongregacionesComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public congregaciones: CongregacionModel[] = [];

  // Subscription
  public congregacionSubscription: Subscription;

  constructor(private router: Router, private congregacionServices: CongregacionService) {}

  ngOnInit(): void {
    this.cargarCongregaciones();
  }

  ngOnDestroy(): void {
    this.congregacionSubscription?.unsubscribe();
  }

  cargarCongregaciones() {
    this.cargando = true;
    this.congregacionSubscription = this.congregacionServices
      .getCongregaciones()
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
        this.cargando = false;
      });
  }

  borrarCongregacion(congregacion: CongregacionModel) {
    Swal.fire({
      title: '¿Borrar Congregación?',
      text: `Esta seguro de borrar la congregación de ${congregacion.congregacion}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.congregacionServices.eliminarCongregacion(congregacion).subscribe((congregacionEliminado) => {
          Swal.fire(
            '¡Deshabilitado!',
            `La congregación ${congregacion.congregacion} fue deshabilitada correctamente`,
            'success'
          );

          this.cargarCongregaciones();
        });
      }
    });
  }

  activarCongregacion(congregacion: CongregacionModel) {
    Swal.fire({
      title: 'Activar Congregación',
      text: `Esta seguro de activar la congregación de ${congregacion.congregacion}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.congregacionServices.activarCongregacion(congregacion).subscribe((congregacionActiva) => {
          Swal.fire('¡Activado!', `La congregación ${congregacion.congregacion} fue activada correctamente`, 'success');

          this.cargarCongregaciones();
        });
      }
    });
  }

  actualizarCongregacion(id: number) {
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CONGREGACIONES}/${id}`);
  }

  crearCongregacion() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CONGREGACIONES}/${nuevo}`);
  }
}
