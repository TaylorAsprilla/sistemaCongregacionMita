import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoActividadEconomicaModel } from 'src/app/core/models/tipo-actividad-economica.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { TipoActividadEconomicaService } from 'src/app/services/tipo-actividad-economica/tipo-actividad-economica.service';
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-actividad-economica',
  templateUrl: './tipo-actividad-economica.component.html',
  styleUrls: ['./tipo-actividad-economica.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass],
})
export class TipoActividadEconomicaComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private tipoActividadEconomicaService = inject(TipoActividadEconomicaService);

  public tipoActividadEconomicaForm: FormGroup;
  public tiposActividadEconomica: TipoActividadEconomicaModel[] = [];
  public editando: boolean = false;
  public actividadSeleccionada: TipoActividadEconomicaModel | null = null;

  // Subscription
  public tipoActividadEconomicaSubscription: Subscription;

  ngOnInit(): void {
    this.tipoActividadEconomicaForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      estado: [true],
    });

    this.cargarTipoActividadesEconomicas();
  }

  ngOnDestroy(): void {
    this.tipoActividadEconomicaSubscription?.unsubscribe();
  }

  cargarTipoActividadesEconomicas() {
    this.tipoActividadEconomicaSubscription = this.tipoActividadEconomicaService
      .getTipoActividadEconomica()
      .subscribe((tipoActividadEconomica: TipoActividadEconomicaModel[]) => {
        this.tiposActividadEconomica = tipoActividadEconomica;
      });
  }

  crearTipoActividadEconomica() {
    if (this.editando && this.actividadSeleccionada) {
      this.actualizarActividad();
      return;
    }

    const tipoActividadEconomicaNueva = this.tipoActividadEconomicaForm.value;

    this.tipoActividadEconomicaService.crearTipoActividadEconomica(tipoActividadEconomicaNueva).subscribe(
      (actividadCreada: any) => {
        const nombreActividad =
          actividadCreada?.tipoActividadEconomicaCreado?.nombre ||
          actividadCreada?.tipoActividadEconomica?.nombre ||
          tipoActividadEconomicaNueva.nombre;
        Swal.fire('Tipo de actividad económica creada', nombreActividad, 'success');
        this.resetFormulario();
        this.cargarTipoActividadesEconomicas();
      },
      (error) => {
        const errores = error.error.errors as { [key: string]: { msg: string } };
        const listaErrores: string[] = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al crear el tipo de Actividad Económica',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
      },
    );
  }

  editarActividad(actividad: TipoActividadEconomicaModel) {
    this.editando = true;
    this.actividadSeleccionada = actividad;
    this.tipoActividadEconomicaForm.patchValue({
      nombre: actividad.nombre,
      estado: actividad.estado,
    });
  }

  actualizarActividad() {
    const tipoActividadEconomicaActualizada = {
      ...this.actividadSeleccionada,
      ...this.tipoActividadEconomicaForm.value,
    };

    this.tipoActividadEconomicaService.actualizarTipoActividadEconomica(tipoActividadEconomicaActualizada).subscribe(
      (actividadActualizada: any) => {
        const nombreActividad =
          actividadActualizada?.tipoActividadEconomica?.nombre || tipoActividadEconomicaActualizada.nombre;
        Swal.fire('Tipo de actividad económica actualizada', nombreActividad, 'success');
        this.resetFormulario();
        this.cargarTipoActividadesEconomicas();
      },
      (error) => {
        Swal.fire({
          title: 'Error al actualizar el tipo de Actividad Económica',
          icon: 'error',
          text: error.error?.msg || 'Ocurrió un error inesperado',
        });
      },
    );
  }

  eliminarActividad(actividad: TipoActividadEconomicaModel) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar el tipo de actividad económica "${actividad.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoActividadEconomicaService.eliminarTipoActividadEconomica(actividad).subscribe(
          () => {
            Swal.fire('Eliminado', 'El tipo de actividad económica ha sido eliminada', 'success');
            this.cargarTipoActividadesEconomicas();
          },
          (error) => {
            Swal.fire({
              title: 'Error al eliminar',
              icon: 'error',
              text: error.error?.msg || 'Ocurrió un error inesperado',
            });
          },
        );
      }
    });
  }

  cancelarEdicion() {
    this.resetFormulario();
  }

  resetFormulario() {
    this.tipoActividadEconomicaForm.reset({
      estado: true,
    });
    this.editando = false;
    this.actividadSeleccionada = null;
  }
}
