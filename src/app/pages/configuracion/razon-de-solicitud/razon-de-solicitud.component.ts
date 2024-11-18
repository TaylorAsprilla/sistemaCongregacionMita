import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { RazonSolicitudService } from 'src/app/services/razon-solicitud/razon-solicitud.service';
import Swal from 'sweetalert2';
import { NgIf, NgFor } from '@angular/common';
import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';

@Component({
    selector: 'app-razon-de-solicitud',
    templateUrl: './razon-de-solicitud.component.html',
    styleUrls: ['./razon-de-solicitud.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        CargandoInformacionComponent,
        NgFor,
    ],
})
export class RazonDeSolicitudComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public razonSolicitudes: RazonSolicitudModel[] = [];

  public razonSolicitudSubscription: Subscription;

  constructor(private razonSolicitudService: RazonSolicitudService) {}

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

  async buscarRazonSolicitud(id: number) {
    let razonSolicitud = '';
    if (id) {
      try {
        const razonEncontrada = await this.razonSolicitudService.getUnaRazonsolicitud(id).pipe(delay(100)).toPromise();
        if (razonEncontrada) {
          // Manejar el caso en que la razón de solicitud es encontrada
          razonSolicitud = razonEncontrada.solicitud;
          console.log('Razón de solicitud encontrada:', razonSolicitud);
        } else {
          // Manejar el caso en que la razón de solicitud no es encontrada
          Swal.fire({
            title: 'Razón de Solicitud',
            icon: 'error',
            html: 'Razón de solicitud no encontrada',
          });
        }
      } catch (error) {
        // Manejar errores de la llamada HTTP
        const errores = (error as any).error.errors as { [key: string]: { msg: string } };
        const listaErrores: string[] = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al obtener la razón de solicitud',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
      }
    }

    return razonSolicitud;
  }

  async actualizarRazonSolicitud(id: number) {
    const opt = await this.buscarRazonSolicitud(id);

    const { value: opcion } = await Swal.fire({
      title: 'Actualizar',
      input: 'text',
      inputLabel: 'Razón de Solicitud',
      showCancelButton: true,
      inputPlaceholder: opt,
    });

    if (opcion) {
      const data = {
        solicitud: opcion,
        id: id,
        estado: true,
      };
      this.razonSolicitudService.actualizarRazonSolicitud(data).subscribe({
        next: (razonActiva: RazonSolicitudModel) => {
          Swal.fire('Actualizada!', `La razón de la solicitud fue actualizada correctamente`, 'success');
          this.cargarRazonSolicitud();
        },
        error: (error) => {
          const errores = error.error.errors as { [key: string]: { msg: string } };
          const listaErrores: string[] = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Error al actualizar la razón de solicitud',
            icon: 'error',
            html: `${listaErrores.join('')}`,
          });
        },
      });
    }
  }

  borrarRazonSolicitud(razonSolicitud: RazonSolicitudModel) {
    Swal.fire({
      title: '¿Borrar?',
      text: `¿Está seguro de borrar ${razonSolicitud.solicitud}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.razonSolicitudService.eliminarRazonSolicitud(razonSolicitud).subscribe({
          next: (razonSolicitudEliminado: RazonSolicitudModel) => {
            Swal.fire(
              '¡Deshabilitado!',
              `La razón de solicitud ${razonSolicitud.solicitud} fue deshabilitada correctamente`,
              'success'
            );
            this.cargarRazonSolicitud();
          },
          error: (error: any) => {
            const errores = error.error.errors as { [key: string]: { msg: string } };
            const listaErrores: string[] = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Error al deshabilitar la razón de solicitud',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });
          },
        });
      }
    });
  }

  activarRazonSolicitud(razonSolicitud: RazonSolicitudModel) {
    Swal.fire({
      title: 'Activar',
      text: `Esta seguro de activar la razón de la solicitud ${razonSolicitud.solicitud}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.razonSolicitudService
          .activarRazonSolicitud(razonSolicitud)
          .subscribe((razonSolicitudActivo: RazonSolicitudModel) => {
            Swal.fire(
              '¡Activado!',
              `La razón de la solicitud ${razonSolicitud.solicitud} fue activado correctamente`,
              'success'
            );

            this.cargarRazonSolicitud();
          });
      }
    });
  }

  async crearRazonSolicitud() {
    const { value: razonSolicitud } = await Swal.fire({
      title: 'Nueva razón',
      input: 'text',
      inputLabel: 'Opción',
      showCancelButton: true,
    });

    if (razonSolicitud) {
      this.razonSolicitudService
        .crearRazonSolicitud(razonSolicitud)
        .subscribe((razonSolicitudActiva: RazonSolicitudModel) => {
          Swal.fire(
            'Creada!',
            `La razón de la solicitud ${razonSolicitud.solicitud} fue creada correctamente`,
            'success'
          );

          this.cargarRazonSolicitud();
        });
      Swal.fire(`${razonSolicitud} creada!`);
    }
  }
}
