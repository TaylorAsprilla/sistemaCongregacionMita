import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitaModel } from 'src/app/core/models/visita.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { VisitaService } from 'src/app/services/visita/visita.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-visitas',
  templateUrl: './informe-visitas.component.html',
  styleUrls: ['./informe-visitas.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class InformeVisitasComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private visitaService = inject(VisitaService);
  private informeService = inject(InformeService);

  public visitaForm: UntypedFormGroup;

  public visitas: VisitaModel[] = [];

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

    this.visitaForm = this.formBuilder.group({
      fecha: [fechaActual, [Validators.required]],
      visitasHogares: ['', []],
      cantidad: ['', []],
      efectivo: ['', []],
      referidasOots: ['', []],
      visitaHospital: ['', []],
      observaciones: ['', []],
      informe_id: [informeId, [Validators.required]],
    });

    this.cargarVisitas();
  }

  private cargarVisitas(): void {
    this.visitaService
      .getVisita()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((visitas) => {
        this.visitas = visitas;
      });
  }

  guardarVisita(): void {
    if (this.visitaForm.invalid) {
      this.visitaForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'warning',
      });
      return;
    }

    const informeVisita = this.visitaForm.value;

    this.visitaService
      .crearVisita(informeVisita)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          Swal.fire('Informe de visitas', 'Se registró el informe de visitas correctamente', 'success');
          this.cargarVisitas();
          this.visitaForm.reset();
          const informeId = this.informeService.informeActivoId;
          const fechaActual = new Date().toISOString().split('T')[0];
          this.visitaForm.patchValue({ fecha: fechaActual, informe_id: informeId });
        },
        error: (error) => {
          this.mostrarErrores('Informe de visitas', error, 'Error al guardar el informe de visitas');
        },
      });
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
