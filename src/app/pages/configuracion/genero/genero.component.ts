import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { GeneroService } from 'src/app/services/genero/genero.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss'],
})
export class GeneroComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public generos: GeneroModel[] = [];

  public generoSubscription: Subscription;

  constructor(private generoService: GeneroService) {}

  ngOnInit(): void {
    this.cargarGeneros();
  }

  ngOnDestroy(): void {
    this.generoSubscription?.unsubscribe();
  }

  cargarGeneros() {
    this.cargando = true;
    this.generoSubscription = this.generoService
      .getGeneros()
      .pipe(delay(100))
      .subscribe((genero: GeneroModel[]) => {
        this.generos = genero;
        this.cargando = false;
      });
  }

  async buscarGenero(id: number) {
    let generoNombre = '';
    if (id) {
      await this.generoService
        .getGenero(Number(id))
        .pipe(delay(100))
        .subscribe(
          (generoEncontrado: GeneroModel) => {
            generoNombre = generoEncontrado.genero;
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

    return generoNombre;
  }

  async actualizarGenero(id: number) {
    let opt = await this.buscarGenero(id);
    const { value: generoNombre } = await Swal.fire({
      title: 'Actualizar Género',
      input: 'text',
      inputLabel: 'Género',
      showCancelButton: true,
      inputPlaceholder: opt,
    });

    if (generoNombre) {
      const data = {
        genero: generoNombre,
        id: id,
        estado: true,
      };
      this.generoService.actualizarGenero(data).subscribe((generoActivo: GeneroModel) => {
        Swal.fire('Actualizado!', `El Género ${generoNombre.genero} se actualizó correctamente`, 'success');

        this.cargarGeneros();
      });
      Swal.fire(`${generoNombre} creado!`);
    }
  }

  borrarGenero(genero: GeneroModel) {
    Swal.fire({
      title: '¿Borrar Género?',
      text: `Esta seguro de borrar ${genero.genero}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.generoService.elimiminarGenero(genero).subscribe((generoEliminado: GeneroModel) => {
          Swal.fire('¡Deshabilitado!', `El género ${genero.genero} fue deshabilitado correctamente`, 'success');

          this.cargarGeneros();
        });
      }
    });
  }

  activarGenero(genero: GeneroModel) {
    Swal.fire({
      title: 'Activar Género',
      text: `Esta seguro de activar el género ${genero.genero}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.generoService.activarGenero(genero).subscribe((generoActivo: GeneroModel) => {
          Swal.fire('¡Activado!', `El género ${genero.genero} fue activado correctamente`, 'success');

          this.cargarGeneros();
        });
      }
    });
  }

  async crearGenero() {
    const { value: genero } = await Swal.fire({
      title: 'Nueva Género',
      input: 'text',
      inputLabel: 'Género',

      showCancelButton: true,
    });

    if (genero) {
      this.generoService.crearGenero(genero).subscribe((generoActivo: GeneroModel) => {
        Swal.fire('Creado!', `El Género ${genero.tipoTransporte} fue creado correctamente`, 'success');

        this.cargarGeneros();
      });
      Swal.fire(`${genero} Creado!`);
    }
  }
}
