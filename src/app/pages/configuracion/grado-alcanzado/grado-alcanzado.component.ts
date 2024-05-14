import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { GradoAcademicoService } from 'src/app/services/grado-academico/grado-academico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grado-alcanzado',
  templateUrl: './grado-alcanzado.component.html',
  styleUrls: ['./grado-alcanzado.component.scss'],
})
export class GradoAlcanzadoComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public gradosAcademicos: GradoAcademicoModel[] = [];

  public gradoAcademicoSubscription: Subscription;

  constructor(private gradoAcademicoService: GradoAcademicoService) {}

  ngOnInit(): void {
    this.cargarGradosAcademicos();
  }

  ngOnDestroy(): void {
    this.gradoAcademicoSubscription?.unsubscribe();
  }

  cargarGradosAcademicos() {
    this.cargando = true;
    this.gradoAcademicoSubscription = this.gradoAcademicoService
      .getGradosAcademicos()
      .pipe(delay(100))
      .subscribe((gradoAcademico: GradoAcademicoModel[]) => {
        this.gradosAcademicos = gradoAcademico;
        this.cargando = false;
      });
  }

  buscarGradoAcademico(id: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!id) {
        reject(new Error('ID no proporcionado'));
        return;
      }

      this.gradoAcademicoService
        .getUnGradoAcademico(Number(id))
        .pipe(delay(100))
        .subscribe(
          (gradoAcademicoEncontrado: GradoAcademicoModel) => {
            console.log('gradoAcademicoEncontrado', gradoAcademicoEncontrado.gradoAcademico);
            resolve(gradoAcademicoEncontrado.gradoAcademico);
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Grado Académico',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            reject(new Error('Error al buscar el grado académico'));
          }
        );
    });
  }

  async actualizarGradoAcademico(id: number) {
    let opcion = await this.buscarGradoAcademico(id);

    const { value: gradoAcademicoNombre } = await Swal.fire({
      title: 'Actualizar Grado Académico',
      input: 'text',
      inputLabel: 'Grado Académico',
      showCancelButton: true,
      inputPlaceholder: opcion,
      inputValue: opcion,
    });

    if (gradoAcademicoNombre) {
      const data = {
        gradoAcademico: gradoAcademicoNombre,
        id: id,
        estado: true,
      };
      this.gradoAcademicoService
        .actualizarGradoAcademico(data)
        .subscribe((gradoAcademicoActivo: GradoAcademicoModel) => {
          Swal.fire(
            'Actualizado!',
            `El Grado Académico ${gradoAcademicoNombre.gradoAcademico} se actualizó correctamente`,
            'success'
          );

          this.cargarGradosAcademicos();
        });
      Swal.fire(`${gradoAcademicoNombre} creado!`);
    }
  }

  borrarGradoAcademico(gradoAcademico: GradoAcademicoModel) {
    Swal.fire({
      title: '¿Borrar Grado Académico?',
      text: `Esta seguro de borrar ${gradoAcademico.gradoAcademico}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gradoAcademicoService
          .eliminarGradoAcademico(gradoAcademico)
          .subscribe((gradoAcademicoEliminado: GradoAcademicoModel) => {
            Swal.fire(
              '¡Deshabilitado!',
              `El género ${gradoAcademico.gradoAcademico} fue deshabilitado correctamente`,
              'success'
            );

            this.cargarGradosAcademicos();
          });
      }
    });
  }

  activarGradoAcademico(gradoAcademico: GradoAcademicoModel) {
    Swal.fire({
      title: 'Activar Grado Académico',
      text: `Esta seguro de activar el género ${gradoAcademico.gradoAcademico}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gradoAcademicoService
          .activarGradoAcademico(gradoAcademico)
          .subscribe((gradoAcademicoActivo: GradoAcademicoModel) => {
            Swal.fire('¡Activado!', `El género ${gradoAcademico.gradoAcademico} fue activado correctamente`, 'success');

            this.cargarGradosAcademicos();
          });
      }
    });
  }

  async crearGradoAcademico() {
    const { value: gradoAcademico } = await Swal.fire({
      title: 'Nueva Grado Académico',
      input: 'text',
      inputLabel: 'Grado Académico',

      showCancelButton: true,
    });

    if (gradoAcademico) {
      this.gradoAcademicoService
        .crearGradoAcademico(gradoAcademico)
        .subscribe((gradoAcademicoActivo: GradoAcademicoModel) => {
          Swal.fire(
            'Creado!',
            `El Grado Académico ${gradoAcademico.tipoTransporte} fue creado correctamente`,
            'success'
          );

          this.cargarGradosAcademicos();
        });
      Swal.fire(`${gradoAcademico} Creado!`);
    }
  }
}
