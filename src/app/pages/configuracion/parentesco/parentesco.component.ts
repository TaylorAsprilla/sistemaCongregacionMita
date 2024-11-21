import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';
import { ParentescoService } from 'src/app/services/parentesco/parentesco.service';
import Swal from 'sweetalert2';
import { NgIf, NgFor } from '@angular/common';
import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';

@Component({
    selector: 'app-parentesco',
    templateUrl: './parentesco.component.html',
    styleUrls: ['./parentesco.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        CargandoInformacionComponent,
        NgFor,
    ],
})
export class ParentescoComponent implements OnInit {
  public cargando: boolean = true;
  public parentescos: ParentescoModel[] = [];

  public parentescoSubscription: Subscription;

  constructor(private parentescoService: ParentescoService) {}

  ngOnInit(): void {
    this.cargarParentescos();
  }

  ngOnDestroy(): void {
    this.parentescoSubscription?.unsubscribe();
  }

  cargarParentescos() {
    this.cargando = true;
    this.parentescoSubscription = this.parentescoService
      .getParentesco()
      .pipe(delay(100))
      .subscribe((parentesco: ParentescoModel[]) => {
        this.parentescos = parentesco;
        this.cargando = false;
      });
  }

  async buscarParentesco(id: number): Promise<string> {
    let tipoDeParentesco = '';
    if (id) {
      this.parentescoService.getUnParentesco(id).subscribe({
        next: (parentescoEncontrado: ParentescoModel | null) => {
          if (parentescoEncontrado) {
            // Manejar el caso en que el parentesco es encontrado
            tipoDeParentesco = parentescoEncontrado.nombre;
            console.log('Parentesco encontrado:', tipoDeParentesco);
          } else {
            // Manejar el caso en que el parentesco no es encontrado
            Swal.fire({
              title: 'Parentesco',
              icon: 'error',
              html: 'Parentesco no encontrado',
            });
          }
        },
        error: (error) => {
          // Manejar errores de la llamada HTTP
          const errores = error.error.errors as { [key: string]: { msg: string } };
          const listaErrores: string[] = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Error al obtener el parentesco',
            icon: 'error',
            html: `${listaErrores.join('')}`,
          });
        },
      });
    }

    return tipoDeParentesco;
  }

  async actualizarParentesco(id: number) {
    let opcion = await this.buscarParentesco(id);

    const { value: parentesco } = await Swal.fire({
      title: 'Actualizar parentesco',
      input: 'text',
      inputLabel: 'Parentesco',
      showCancelButton: true,
      inputPlaceholder: opcion,
    });

    if (parentesco) {
      const data = {
        nombre: parentesco,
        id: id,
        estado: true,
      };
      this.parentescoService.actualizarParentesco(data).subscribe((parentescoActiva: ParentescoModel) => {
        Swal.fire('Creada!', `El parentesco ${parentesco.tipo} fue creado correctamente`, 'success');

        this.cargarParentescos();
      });
      Swal.fire(`${parentesco} creada!`);
    }
  }

  borrarParentesco(parentesco: ParentescoModel) {
    Swal.fire({
      title: '¿Borrar Parentesco?',
      text: `Esta seguro de borrar ${parentesco.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parentescoService.eliminarParentesco(parentesco).subscribe(() => {
          Swal.fire('¡Deshabilitado!', `El parentesco ${parentesco.nombre} fue deshabilitado correctamente`, 'success');

          this.cargarParentescos();
        });
      }
    });
  }

  activarParentesco(parentesco: ParentescoModel) {
    Swal.fire({
      title: 'Activar Parentesco',
      text: `Esta seguro de activar el parentesco ${parentesco.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parentescoService.activarParentesco(parentesco).subscribe((parentescoActivo: ParentescoModel) => {
          Swal.fire('¡Activado!', `El parentesco ${parentesco.nombre} fue activado correctamente`, 'success');

          this.cargarParentescos();
        });
      }
    });
  }

  async crearParentesco() {
    const { value: tipo } = await Swal.fire({
      title: 'Nuevo Parentesco',
      input: 'text',
      inputLabel: 'Parentesco',
      showCancelButton: true,
    });

    if (tipo) {
      this.parentescoService.crearParentesco(tipo).subscribe((parentescoActiva: ParentescoModel) => {
        Swal.fire('Creada!', `El parentesco ${tipo.tipo} fue creada correctamente`, 'success');

        this.cargarParentescos();
      });
      Swal.fire(`${tipo} creada!`);
    }
  }
}
