import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { MinisterioService } from 'src/app/services/ministerio/ministerio.service';
import Swal from 'sweetalert2';

import { CargandoInformacionComponent } from '../../../../components/cargando-informacion/cargando-informacion.component';

@Component({
  selector: 'app-ministerios',
  templateUrl: './ministerios.component.html',
  styleUrls: ['./ministerios.component.css'],
  standalone: true,
  imports: [CargandoInformacionComponent],
})
export class MinisteriosComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private ministerioService = inject(MinisterioService);

  public cargando: boolean = true;
  public ministerios: MinisterioModel[] = [];

  // Subscription
  public ministerioSubscription: Subscription;

  ngOnInit(): void {
    this.cargarMinisterios();
  }

  ngOnDestroy(): void {
    this.ministerioSubscription?.unsubscribe();
  }

  cargarMinisterios() {
    this.cargando = true;
    this.ministerioSubscription = this.ministerioService
      .getMinisterios()
      .subscribe((ministerios: MinisterioModel[]) => {
        this.ministerios = ministerios;
        this.cargando = false;
      });
  }

  borrarMinisterio(ministerio: MinisterioModel) {
    Swal.fire({
      title: '¿Borrar Ministerio?',
      text: `Esta seguro de borrar el ministerio ${ministerio.ministerio}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ministerioService.eliminarMinisterio(ministerio).subscribe((ministerioEliminado) => {
          Swal.fire(
            '¡Deshabilitado!',
            `El ministerio ${ministerio.ministerio} fue deshabilitado correctamente`,
            'success'
          );

          this.cargarMinisterios();
        });
      }
    });
  }

  activarMinisterio(ministerio: MinisterioModel) {
    Swal.fire({
      title: 'Activar Ministerio',
      text: `Esta seguro de activar el ministerio ${ministerio.ministerio}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ministerioService.activarMinisterio(ministerio).subscribe((ministerioActivo) => {
          Swal.fire('¡Activado!', `El ministerio ${ministerio.ministerio} fue activado correctamente`, 'success');

          this.cargarMinisterios();
        });
      }
    });
  }

  actualizarMinisterio(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.MINISTERIOS}/${id}`);
  }

  crearMinisterio() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.MINISTERIOS}/${nuevo}`);
  }
}
