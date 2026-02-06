import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CrearActividadComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private tipoActividadService = inject(TipoActividadService);

  public tipoActividadForm: FormGroup;

  public tiposActividad: TipoActividadModel[] = [];
  public editando: boolean = false;
  public actividadIdEditando: number | null = null;

  // Subscription
  public tipoActividadSubscription: Subscription;

  ngOnInit(): void {
    this.tipoActividadForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      estado: [true, [Validators.required]],
    });

    this.cargarTipoActividades();
  }

  ngOnDestroy(): void {
    this.tipoActividadSubscription?.unsubscribe();
  }

  cargarTipoActividades() {
    this.tipoActividadSubscription = this.tipoActividadService
      .getTipoActividad()
      .subscribe((tipoActividad: TipoActividadModel[]) => {
        this.tiposActividad = tipoActividad.filter((actividad) => actividad.estado === true);
      });
  }

  crearTipoActividad() {
    if (this.editando && this.actividadIdEditando) {
      this.actualizarActividad();
      return;
    }

    const tipoActividadNueva = this.tipoActividadForm.value;

    this.tipoActividadService.crearTipoActividad(tipoActividadNueva).subscribe(
      (actividadCreada: any) => {
        Swal.fire('Tipo de actividad creada', `${actividadCreada.tipoActividadCreado.nombre}`, 'success');
        this.resetFormulario();
        this.cargarTipoActividades();
      },
      (error) => {
        const errores = error.error.errors as { [key: string]: { msg: string } };
        const listaErrores: string[] = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al crear el tipo de Actividad',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
      },
    );
  }

  editarActividad(actividad: TipoActividadModel) {
    this.editando = true;
    this.actividadIdEditando = actividad.id;
    this.tipoActividadForm.patchValue({
      nombre: actividad.nombre,
      estado: actividad.estado,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  actualizarActividad() {
    const actividadActualizada = {
      ...this.tipoActividadForm.value,
      id: this.actividadIdEditando,
    };

    this.tipoActividadService.actualizarTipoActividad(actividadActualizada).subscribe(
      (response: any) => {
        Swal.fire('Tipo de actividad actualizada', response.actividadActualizada.nombre, 'success');
        this.cancelarEdicion();
        this.cargarTipoActividades();
      },
      (error) => {
        Swal.fire('Error', 'No se pudo actualizar el tipo de actividad', 'error');
      },
    );
  }

  eliminarActividad(actividad: TipoActividadModel) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar la actividad "${actividad.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoActividadService.eliminarTipoActividad(actividad.id).subscribe(
          () => {
            Swal.fire('Eliminado', 'La actividad ha sido eliminada', 'success');
            this.cargarTipoActividades();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar la actividad', 'error');
          },
        );
      }
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.actividadIdEditando = null;
    this.resetFormulario();
  }

  obtenerEstadoTexto(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  resetFormulario() {
    this.tipoActividadForm.reset();
    this.tipoActividadForm.patchValue({
      nombre: '',
      estado: true,
    });
  }
}
