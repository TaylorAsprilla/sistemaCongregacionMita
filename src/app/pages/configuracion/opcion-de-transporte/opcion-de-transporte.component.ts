import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OpcionTransporteModel } from 'src/app/core/models/opcion-transporte.model';
import { OpcionTransporteService } from 'src/app/services/opcion-transporte/opcion-transporte.service';

import Swal from 'sweetalert2';

import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';

@Component({
  selector: 'app-opcion-de-transporte',
  templateUrl: './opcion-de-transporte.component.html',
  styleUrls: ['./opcion-de-transporte.component.scss'],
  standalone: true,
  imports: [CargandoInformacionComponent],
})
export class OpcionDeTransporteComponent implements OnInit, OnDestroy {
  private opcionTransporteService = inject(OpcionTransporteService);

  public cargando: boolean = true;
  public opcionesTransporte: OpcionTransporteModel[] = [];

  public opcionTransporteSubscription: Subscription;

  ngOnInit(): void {
    this.cargarOpcionesDeTransporte();
  }

  ngOnDestroy(): void {
    this.opcionTransporteSubscription?.unsubscribe();
  }

  cargarOpcionesDeTransporte() {
    this.cargando = true;
    this.opcionTransporteSubscription = this.opcionTransporteService
      .getOpcionTransporte()
      .pipe(delay(100))
      .subscribe((opcionTransporte: OpcionTransporteModel[]) => {
        this.opcionesTransporte = opcionTransporte;
        this.cargando = false;
      });
  }

  buscarOpcionDeTransporte(id: number) {
    let tipoTransporte = '';
    if (id) {
      this.opcionTransporteService
        .getUnaOpcionTransporte(Number(id))
        .pipe(delay(100))
        .subscribe(
          (opcionEncontrada: OpcionTransporteModel) => {
            tipoTransporte = opcionEncontrada.tipoTransporte;
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores: string[] = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Transporte',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });
          }
        );
    }

    return tipoTransporte;
  }

  async actualizarOpcionDeTransporte(id: number) {
    let opcionDeTransporte = this.buscarOpcionDeTransporte(id);

    const { value: opcion } = await Swal.fire({
      title: 'Actualizar opción de transporte',
      input: 'text',
      inputLabel: 'Opción',
      showCancelButton: true,
      inputPlaceholder: opcionDeTransporte,
    });

    if (opcion) {
      const data = {
        tipoTransporte: opcion,
        id: id,
        estado: true,
      };
      this.opcionTransporteService.actualizarOpcionTransporte(data).subscribe((opcionActiva: OpcionTransporteModel) => {
        Swal.fire('Creada!', `La opción de transporte ${opcion.tipoTransporte} fue creada correctamente`, 'success');

        this.cargarOpcionesDeTransporte();
      });
      Swal.fire(`${opcion} creada!`);
    }
  }

  borrarOpcionDeTransporte(opcion: OpcionTransporteModel) {
    Swal.fire({
      title: '¿Borrar Opción de Transporte?',
      text: `Esta seguro de borrar la opción ${opcion.tipoTransporte}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.opcionTransporteService.eliminarOpcionTransporte(opcion).subscribe(() => {
          Swal.fire(
            '¡Deshabilitado!',
            `La opción de transporte ${opcion.tipoTransporte} fue deshabilitado correctamente`,
            'success'
          );

          this.cargarOpcionesDeTransporte();
        });
      }
    });
  }

  activarOpcionDeTransporte(opcion: OpcionTransporteModel) {
    Swal.fire({
      title: 'Activar Opción de Transporte',
      text: `Esta seguro de activar la opción ${opcion.tipoTransporte}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.opcionTransporteService
          .activarOpcionTransporte(opcion)
          .subscribe((opcionActiva: OpcionTransporteModel) => {
            Swal.fire(
              '¡Activado!',
              `La opción de transporte ${opcion.tipoTransporte} fue activada correctamente`,
              'success'
            );

            this.cargarOpcionesDeTransporte();
          });
      }
    });
  }

  async crearOpcionDeTransporte() {
    const { value: tipoTransporte } = await Swal.fire({
      title: 'Nueva opción de Transporte',
      input: 'text',
      inputLabel: 'Opción',
      showCancelButton: true,
    });

    if (tipoTransporte) {
      this.opcionTransporteService
        .crearOpcionTransporte(tipoTransporte)
        .subscribe((opcionActiva: OpcionTransporteModel) => {
          Swal.fire('Creada!', `La opción ${tipoTransporte.tipoTransporte} fue creada correctamente`, 'success');

          this.cargarOpcionesDeTransporte();
        });
      Swal.fire(`${tipoTransporte} creada!`);
    }
  }
}
