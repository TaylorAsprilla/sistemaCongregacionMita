import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { VoluntariadoService } from 'src/app/services/voluntariado/voluntariado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voluntario',
  templateUrl: './voluntario.component.html',
  styleUrls: ['./voluntario.component.scss'],
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

  async buscarVoluntariado(id: number) {
    let voluntariadoNombre = '';
    if (id) {
      await this.voluntariadoService
        .getUnVoluntariado(Number(id))
        .pipe(delay(100))
        .subscribe(
          (voluntariadoEncontrado: VoluntariadoModel) => {
            voluntariadoNombre = voluntariadoEncontrado.nombreVoluntariado;
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Género',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });
          }
        );
    }

    return voluntariadoNombre;
  }

  async actualizarVoluntariado(id: number) {
    let opt = await this.buscarVoluntariado(id);
    const { value: voluntariadoNombre } = await Swal.fire({
      title: 'Actualizar Voluntariado',
      input: 'text',
      inputLabel: 'Voluntariado',
      showCancelButton: true,
      inputPlaceholder: opt,
    });

    if (voluntariadoNombre) {
      const data = {
        nombreVoluntariado: voluntariadoNombre,
        id: id,
        estado: true,
      };
      this.voluntariadoService.actualizarTipoMiembro(data).subscribe((voluntariadoActivo: VoluntariadoModel) => {
        Swal.fire('Actualizado!', `El Género ${voluntariadoNombre.voluntariado} se actualizó correctamente`, 'success');

        this.cargarVoluntariados();
      });
      Swal.fire(`${voluntariadoNombre} creado!`);
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
          .eliminarYipoMiembro(voluntariado)
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
        this.voluntariadoService.activarTipoMiembro(voluntariado).subscribe((voluntariadoActivo: VoluntariadoModel) => {
          Swal.fire('¡Activado!', `El género ${voluntariado.nombreVoluntariado} fue activado correctamente`, 'success');

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
      this.voluntariadoService.crearVoluntariado(voluntariado).subscribe((voluntariadoActivo: VoluntariadoModel) => {
        Swal.fire('Creado!', `El voluntariado ${voluntariado.tipoTransporte} fue creado correctamente`, 'success');

        this.cargarVoluntariados();
      });
      Swal.fire(`${voluntariado} Creado!`);
    }
  }
}
