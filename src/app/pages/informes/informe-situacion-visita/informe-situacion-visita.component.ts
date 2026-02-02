import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  imports: [FormsModule, ReactiveFormsModule],
})
export class InformeSituacionVisitaComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private situacionVisitaService = inject(SituacionVisitaService);
  private informeService = inject(InformeService);

  public situacionVisitaForm: UntypedFormGroup;

  public situacionVisitas: SituacionVisitaModel[] = [];

  ngOnInit(): void {
    const informeId = this.informeService.informeActivoId;
    const fechaActual = new Date().toISOString().split('T')[0];

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
      intervencion: ['', []],
      seguimiento: ['', []],
      observaciones: ['', []],
      informe_id: [informeId, [Validators.required]],
    });

    this.cargarSituacionVisitas();
  }

  private cargarSituacionVisitas(): void {
    this.situacionVisitaService
      .getSituacionVisitas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((situaciones) => {
        this.situacionVisitas = situaciones;
      });
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

    this.situacionVisitaService
      .crearSituacionVisita(informeSituacionVisita)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          Swal.fire('Situación de Visita', 'Se registró la situación de visita correctamente', 'success');
          this.navegarAlInforme();
        },
        error: (error) => {
          this.mostrarErrores('Situación de Visita', error, 'Error al guardar la situación de visita');
        },
      });
  }

  private navegarAlInforme(): void {
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
