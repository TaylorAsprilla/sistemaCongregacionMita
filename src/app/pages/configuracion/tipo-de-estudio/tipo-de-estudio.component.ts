import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TipoEstudioModel } from 'src/app/core/models/tipo-estudio.model';
import { TipoEstudioService } from 'src/app/services/tipo-estudio/tipo-estudio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-de-estudio',
  templateUrl: './tipo-de-estudio.component.html',
  styleUrls: ['./tipo-de-estudio.component.scss'],
})
export class TipoDeEstudioComponent implements OnInit {
  public cargando: boolean = true;
  public tipoEstudios: TipoEstudioModel[] = [];

  public tipoEstudioSubscription: Subscription;

  constructor(private tipoEstudioService: TipoEstudioService) {}

  ngOnInit(): void {
    this.cargartipoEstudios();
  }

  ngOnDestroy(): void {
    this.tipoEstudioSubscription?.unsubscribe();
  }

  cargartipoEstudios() {
    this.cargando = true;
    this.tipoEstudioSubscription = this.tipoEstudioService
      .getTipoEstudio()
      .pipe(delay(100))
      .subscribe((tipoEstudio: TipoEstudioModel[]) => {
        this.tipoEstudios = tipoEstudio;
        this.cargando = false;
      });
  }

  async actualizartipoEstudio(id: number, value: string) {
    const { value: tipoEstudioNombre } = await Swal.fire({
      title: 'Actualizar',
      input: 'text',
      inputLabel: 'Tipo de Estudio',
      showCancelButton: true,
      inputValue: value,
    });

    if (tipoEstudioNombre) {
      const data = {
        estudio: tipoEstudioNombre,
        id: id,
        estado: true,
      };
      this.tipoEstudioService.actualizarTipoEstudio(data).subscribe((tipoEstudio: TipoEstudioModel) => {
        Swal.fire(
          'Creada!',
          `El tipo de estudio ${tipoEstudioNombre.estudio} fue actualizado correctamente`,
          'success'
        );

        this.cargartipoEstudios();
      });
      Swal.fire(`${tipoEstudioNombre} creada!`);
    }
  }

  borrartipoEstudio(tipoEstudio: TipoEstudioModel) {
    Swal.fire({
      title: '¿Borrar?',
      text: `Esta seguro de borrar tipo de estudio ${tipoEstudio.estudio}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoEstudioService.eliminarTipoEmpleo(tipoEstudio).subscribe((tipoEstudioEliminado: TipoEstudioModel) => {
          Swal.fire(
            '¡Deshabilitado!',
            `El tipo estudio ${tipoEstudio.estudio} fue deshabilitado correctamente`,
            'success'
          );

          this.cargartipoEstudios();
        });
      }
    });
  }

  activartipoEstudio(tipoEstudio: TipoEstudioModel) {
    Swal.fire({
      title: 'Activar',
      text: `Esta seguro de activar la opción ${tipoEstudio.estudio}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoEstudioService.activarTipoEmpleo(tipoEstudio).subscribe((tipoEstudioActiva: TipoEstudioModel) => {
          Swal.fire('¡Activado!', `El tipo de estudio ${tipoEstudio.estudio} fue activada correctamente`, 'success');

          this.cargartipoEstudios();
        });
      }
    });
  }

  async crearTipoEstudio() {
    const { value: tipoEstudio } = await Swal.fire({
      title: 'Tipo de Estudio',
      input: 'text',
      inputLabel: 'Opción',

      showCancelButton: true,
    });

    if (tipoEstudio) {
      this.tipoEstudioService.crearTipoEstudio(tipoEstudio).subscribe((tipoEstudioActivo: TipoEstudioModel) => {
        Swal.fire('Creada!', `El tipo de estudio ${tipoEstudio.estudio} fue creada correctamente`, 'success');

        this.cargartipoEstudios();
      });
      Swal.fire(`${tipoEstudio} creada!`);
    }
  }
}
