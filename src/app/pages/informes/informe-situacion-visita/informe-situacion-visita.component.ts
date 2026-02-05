import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { SituacionVisitaService } from 'src/app/services/situacion-visita/situacion-visita.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-situacion-visita',
  templateUrl: './informe-situacion-visita.component.html',
  styleUrls: ['./informe-situacion-visita.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
})
export class InformeSituacionVisitaComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private situacionVisitaService = inject(SituacionVisitaService);
  private informeService = inject(InformeService);

  public situacionVisitaForm: UntypedFormGroup;

  public situacionVisitas: SituacionVisitaModel[] = [];
  public editando: boolean = false;
  public situacionSeleccionada: SituacionVisitaModel | null = null;
  public fechaMinima: string;
  public fechaMaxima: string;

  constructor() {
    const fechaActual = new Date().toISOString().split('T')[0];
    const informeId = this.informeService.informeActivoId;

    // Calcular fechas del trimestre actual
    const fechasTrimestre = this.obtenerFechasTrimestreActual();
    this.fechaMinima = fechasTrimestre.min;
    this.fechaMaxima = fechasTrimestre.max;

    // Verificar si hay informe activo
    if (!informeId) {
      Swal.fire({
        title: 'Sin informe activo',
        text: 'No hay un informe activo. Por favor, genera un informe primero.',
        icon: 'warning',
        confirmButtonText: 'Ir a Informes',
      }).then(() => {
        this.navegarAlInforme();
      });
      return;
    }

    this.situacionVisitaForm = this.formBuilder.group({
      fecha: [fechaActual, [Validators.required]],
      nombreFeligres: ['', [Validators.required]],
      situacion: ['', []],
      intervension: ['', []],
      seguimiento: ['', []],
      observaciones: ['', []],
      informe_id: [informeId, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarSituacionVisitas();
  }

  private obtenerFechasTrimestreActual(): { min: string; max: string } {
    const hoy = new Date();
    const mes = hoy.getMonth();
    const anio = hoy.getFullYear();

    // Determinar el trimestre (0=Q1, 1=Q2, 2=Q3, 3=Q4)
    const trimestre = Math.floor(mes / 3);

    // Primer mes del trimestre (0, 3, 6, 9)
    const primerMesTrimestre = trimestre * 3;

    // Fecha mínima: primer día del primer mes del trimestre
    const fechaMinima = new Date(anio, primerMesTrimestre, 1);

    // Fecha máxima: último día del último mes del trimestre
    const fechaMaxima = new Date(anio, primerMesTrimestre + 3, 0);

    return {
      min: fechaMinima.toISOString().split('T')[0],
      max: fechaMaxima.toISOString().split('T')[0],
    };
  }

  private cargarSituacionVisitas(): void {
    const informeId = this.informeService.informeActivoId;
    if (!informeId) return;

    this.situacionVisitaService
      .getSituacionVisitas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((situaciones) => {
        this.situacionVisitas = situaciones.filter(
          (s: SituacionVisitaModel) => s.informe_id === informeId && s.estado !== false,
        );
      });
  }

  editarSituacion(situacion: SituacionVisitaModel): void {
    this.editando = true;
    this.situacionSeleccionada = situacion;
    this.situacionVisitaForm.patchValue({
      fecha: situacion.fecha,
      nombreFeligres: situacion.nombreFeligres,
      situacion: situacion.situacion,
      intervension: situacion.intervension,
      seguimiento: situacion.seguimiento,
      observaciones: situacion.observaciones,
      informe_id: situacion.informe_id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarSituacion(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.situacionVisitaService
          .eliminarSituacionVisita(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'La situación ha sido eliminada correctamente', 'success');
              this.cargarSituacionVisitas();
              if (this.situacionSeleccionada?.id === id) {
                this.cancelarEdicion();
              }
            },
            error: (error) => {
              this.mostrarErrores('Error', error, 'No se pudo eliminar la situación');
            },
          });
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.situacionSeleccionada = null;
    this.situacionVisitaForm.reset();
    const informeId = this.informeService.informeActivoId;
    const fechaActual = new Date().toISOString().split('T')[0];
    this.situacionVisitaForm.patchValue({ fecha: fechaActual, informe_id: informeId });
  }

  guardarSituacionVisita(): void {
    if (this.situacionVisitaForm.invalid) {
      this.situacionVisitaForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'warning',
      });
      return;
    }

    const informeSituacionVisita = this.situacionVisitaForm.value;

    if (this.editando && this.situacionSeleccionada) {
      // Actualizar situación existente
      this.situacionVisitaService
        .actualizarSituacionVisita(this.situacionSeleccionada.id, informeSituacionVisita)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Situación de Visita', 'Se actualizó la situación correctamente', 'success');
            this.cargarSituacionVisitas();
            this.cancelarEdicion();
          },
          error: (error) => {
            this.mostrarErrores('Situación de Visita', error, 'Error al actualizar la situación');
          },
        });
    } else {
      // Crear nueva situación
      this.situacionVisitaService
        .crearSituacionVisita(informeSituacionVisita)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Situación de Visita', 'Se registró la situación de visita correctamente', 'success');
            this.cargarSituacionVisitas();
            this.situacionVisitaForm.reset();
            const informeId = this.informeService.informeActivoId;
            const fechaActual = new Date().toISOString().split('T')[0];
            this.situacionVisitaForm.patchValue({ fecha: fechaActual, informe_id: informeId });
          },
          error: (error) => {
            this.mostrarErrores('Situación de Visita', error, 'Error al guardar la situación de visita');
          },
        });
    }
  }

  navegarAlInforme(): void {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }

  private mostrarErrores(titulo: string, error: any, mensajeExtra: string = ''): void {
    const errores = error?.error?.errors as { [key: string]: { msg: string } };
    if (!errores) {
      Swal.fire({
        title: titulo,
        text: 'Ocurrió un error inesperado',
        icon: 'error',
      });
      return;
    }

    const listaErrores = Object.values(errores)
      .map((value) => `° ${value.msg}`)
      .join('<br>');

    Swal.fire({
      title: titulo,
      icon: 'error',
      html: `${mensajeExtra ? mensajeExtra + '<p>' : ''}${listaErrores}`,
    });
  }
}
