import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TipoEstudioModel } from 'src/app/core/models/tipo-estudio.model';
import { RUTAS } from 'src/app/routes/menu-items';
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

  constructor(
    private router: Router,
    private tipoEstudioService: TipoEstudioService,
    private activatedRoute: ActivatedRoute
  ) {}

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

  async buscarTipoEstudio(id: number) {
    let tipoEstudio = '';
    if (id) {
      await this.tipoEstudioService
        .getUnTipoEstudio(Number(id))
        .pipe(delay(100))
        .subscribe(
          (tipoEstudioEncontrado: TipoEstudioModel) => {
            tipoEstudio = tipoEstudioEncontrado.estudio;
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Congregacion',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });
          }
        );
    }
    return tipoEstudio;
  }

  async actualizartipoEstudio(id: number) {
    let opt = await this.buscarTipoEstudio(id);

    const { value: tipoEstudioNombre } = await Swal.fire({
      title: 'Actualizar',
      input: 'text',
      inputLabel: 'Tipo de Estudio',
      showCancelButton: true,
      inputPlaceholder: opt,
    });

    if (tipoEstudioNombre) {
      const data = {
        estudio: tipoEstudioNombre,
        id: id,
        estado: true,
      };
      this.tipoEstudioService.actualizarTipoEstudio(data).subscribe((tipoEstudiaActiva: TipoEstudioModel) => {
        Swal.fire('Creada!', `El tipo de estudio ${tipoEstudioNombre.estudio} fue creado correctamente`, 'success');

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
