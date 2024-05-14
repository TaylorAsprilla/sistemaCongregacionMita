import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { EstadoCivilService } from 'src/app/services/estado-civil/estado-civil.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estado-civil',
  templateUrl: './estado-civil.component.html',
  styleUrls: ['./estado-civil.component.scss'],
})
export class EstadoCivilComponent implements OnInit {
  public cargando: boolean = true;
  public estadosCiviles: EstadoCivilModel[] = [];

  public estadoCivilSubscription: Subscription;

  constructor(private estadoCivilService: EstadoCivilService) {}

  ngOnInit(): void {
    this.cargarEstadosCiviles();
  }

  ngOnDestroy(): void {
    this.estadoCivilSubscription?.unsubscribe();
  }

  cargarEstadosCiviles() {
    this.cargando = true;
    this.estadoCivilSubscription = this.estadoCivilService
      .getEstadoCiviles()
      .pipe(delay(100))
      .subscribe((estadoCivil: EstadoCivilModel[]) => {
        this.estadosCiviles = estadoCivil;
        this.cargando = false;
      });
  }

  buscarEstadoCivil(id: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!id) {
        reject(new Error('ID no proporcionado'));
        return;
      }

      this.estadoCivilService
        .getEstadoCivil(Number(id))
        .pipe(delay(100))
        .subscribe(
          (estadoCivilEncontrado: EstadoCivilModel) => {
            resolve(estadoCivilEncontrado.estadoCivil);
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];
            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });
            Swal.fire({
              title: 'Estado Civil',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });
            reject(new Error('Error al buscar el estado civil'));
          }
        );
    });
  }

  async actualizarestadoCivil(id: number) {
    let opcion = await this.buscarEstadoCivil(id);
    const { value: estadoCivilNombre } = await Swal.fire({
      title: 'Actualizar Estado Civil',
      input: 'text',
      inputLabel: 'Estado Civil',
      showCancelButton: true,
      inputPlaceholder: opcion,
    });
    if (estadoCivilNombre) {
      const data = {
        estadoCivil: estadoCivilNombre,
        id: id,
        estado: true,
      };
      this.estadoCivilService.actualizarEstadoCivil(data).subscribe((estadoCivilActivo: EstadoCivilModel) => {
        Swal.fire(
          'Actualizado!',
          `El Estado Civil ${estadoCivilNombre.estadoCivil} se actualizó correctamente`,
          'success'
        );
        this.cargarEstadosCiviles();
      });
      Swal.fire(`${estadoCivilNombre} creado!`);
    }
  }

  borrarEstadoCivil(estadoCivil: EstadoCivilModel) {
    Swal.fire({
      title: '¿Borrar Estado Civil?',
      text: `Esta seguro de borrar ${estadoCivil.estadoCivil}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.estadoCivilService
          .elimiminarEstadoCivil(estadoCivil)
          .subscribe((estadoCivilEliminado: EstadoCivilModel) => {
            Swal.fire(
              '¡Deshabilitado!',
              `El estado civil ${estadoCivil.estadoCivil} fue deshabilitado correctamente`,
              'success'
            );

            this.cargarEstadosCiviles();
          });
      }
    });
  }

  activarEstadoCivil(estadoCivil: EstadoCivilModel) {
    Swal.fire({
      title: 'Activar Estado Civil',
      text: `Esta seguro de activar el estado civil ${estadoCivil.estadoCivil}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.estadoCivilService.activarEstadoCivil(estadoCivil).subscribe((estadoCivilActivo: EstadoCivilModel) => {
          Swal.fire('¡Activado!', `El estado civil ${estadoCivil.estadoCivil} fue activado correctamente`, 'success');

          this.cargarEstadosCiviles();
        });
      }
    });
  }

  async crearEstadoCivil() {
    const { value: estadoCivil } = await Swal.fire({
      title: 'Nuevo Estado Civil',
      input: 'text',
      inputLabel: 'Estado Civil',

      showCancelButton: true,
    });

    if (estadoCivil) {
      this.estadoCivilService.crearEstadoCivil(estadoCivil).subscribe((estadoCivilActivo: EstadoCivilModel) => {
        Swal.fire('Creado!', `El Estado Civil ${estadoCivil.tipoTransporte} fue creado correctamente`, 'success');

        this.cargarEstadosCiviles();
      });
      Swal.fire(`${estadoCivil} Creado!`);
    }
  }
}
