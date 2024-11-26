import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { VoluntariadoService } from 'src/app/services/voluntariado/voluntariado.service';
import Swal from 'sweetalert2';

import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';

@Component({
    selector: 'app-voluntario',
    templateUrl: './voluntario.component.html',
    styleUrls: ['./voluntario.component.scss'],
    standalone: true,
    imports: [
    CargandoInformacionComponent
],
})
export class VoluntarioComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public voluntariados: VoluntariadoModel[] = [];

  public voluntariadoSubscription: Subscription;

  constructor(private voluntariadoService: VoluntariadoService) {}

  ngOnInit(): void {
    this.cargarVoluntariados();
  }

  ngOnDestroy(): void {
    this.voluntariadoSubscription?.unsubscribe();
  }

  cargarVoluntariados() {
    this.cargando = true;
    this.voluntariadoSubscription = this.voluntariadoService
      .getVoluntariados()
      .pipe(delay(100))
      .subscribe((voluntariado: VoluntariadoModel[]) => {
        this.voluntariados = voluntariado;
        this.cargando = false;
      });
  }

  buscarVoluntariado(id: number): string | undefined {
    return this.voluntariados.find((voluntariado: VoluntariadoModel) => voluntariado.id === id)?.nombreVoluntariado;
  }

  async actualizarVoluntariado(id: number) {
    let voluntariado = this.buscarVoluntariado(id);
    const { value: voluntariadoNombre } = await Swal.fire({
      title: 'Actualizar Voluntariado',
      input: 'text',
      inputLabel: 'Voluntariado',
      showCancelButton: true,
      inputValue: voluntariado,
    });

    if (voluntariadoNombre) {
      const data = {
        nombreVoluntariado: voluntariadoNombre,
        id: id,
        estado: true,
      };
      this.voluntariadoService.actualizarVoluntariado(data).subscribe(
        (voluntariadoActivo: VoluntariadoModel) => {
          Swal.fire(
            'Actualizado!',
            `El voluntariado <b>${voluntariadoNombre}</b> se actualizó correctamente`,
            'success'
          );

          this.cargarVoluntariados();
        },
        (error) => {
          let errores = error.error;

          Swal.fire({
            title: 'Error al actualizar voluntariado',
            icon: 'error',
            html: `${errores?.msg}`,
          });
        }
      );
    }
  }

  borrarVoluntariado(voluntariado: VoluntariadoModel) {
    Swal.fire({
      title: '¿Borrar Género?',
      text: `Esta seguro de borrar ${voluntariado.nombreVoluntariado}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.voluntariadoService
          .eliminarVoluntariado(voluntariado)
          .subscribe((voluntariadoEliminado: VoluntariadoModel) => {
            Swal.fire(
              '¡Deshabilitado!',
              `El género ${voluntariado.nombreVoluntariado} fue deshabilitado correctamente`,
              'success'
            );

            this.cargarVoluntariados();
          });
      }
    });
  }

  activarVoluntariado(voluntariado: VoluntariadoModel) {
    Swal.fire({
      title: 'Activar Género',
      text: `Esta seguro de activar el género ${voluntariado.nombreVoluntariado}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.voluntariadoService
          .activarVoluntariado(voluntariado)
          .subscribe((voluntariadoActivo: VoluntariadoModel) => {
            Swal.fire(
              '¡Activado!',
              `El género ${voluntariado.nombreVoluntariado} fue activado correctamente`,
              'success'
            );

            this.cargarVoluntariados();
          });
      }
    });
  }

  async crearVoluntariado() {
    const { value: voluntariado } = await Swal.fire({
      title: 'Nuevo Voluntariado',
      input: 'text',
      inputLabel: 'Voluntariado',

      showCancelButton: true,
    });

    if (voluntariado) {
      this.voluntariadoService.crearVoluntariado(voluntariado).subscribe((nuevoVoluntariado: any) => {
        Swal.fire('Creado!', ` ${nuevoVoluntariado.msg} `, 'success');

        this.cargarVoluntariados();
      });
    }
  }
}
