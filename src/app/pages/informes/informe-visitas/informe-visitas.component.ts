import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitaModel } from 'src/app/core/models/visita.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { VisitaService } from 'src/app/services/visita/visita.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { MESES, MesItem, getNombreMes, obtenerMesesTrimestreActual } from 'src/app/core/constants/meses.constant';
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
  public editando: boolean = false;
  public visitaSeleccionada: VisitaModel | null = null;

  // Array de todos los meses
  private readonly todosMeses = MESES;

  // Array de meses del trimestre actual
  public meses: MesItem[] = [];

  ngOnInit(): void {
    // Calcular meses del trimestre actual
    this.meses = obtenerMesesTrimestreActual();
    const informeId = this.informeService.informeActivoId;

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
      mes: ['', [Validators.required]],
      visitasHogares: ['', [Validators.required]],
      referidasOots: ['', [Validators.required]],
      visitaHospital: ['', [Validators.required]],
      observaciones: ['', []],
      informe_id: [informeId, [Validators.required]],
    });

    this.cargarVisitas();
  }

  private cargarVisitas(): void {
    const informeId = this.informeService.informeActivoId;
    if (!informeId) return;

    this.visitaService
      .getVisita()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((visitas) => {
        this.visitas = visitas.filter(
          (visita: VisitaModel) => visita.informe_id === informeId && visita.estado !== false,
        );
      });
  }

  editarVisita(visita: VisitaModel): void {
    this.editando = true;
    this.visitaSeleccionada = visita;
    this.visitaForm.patchValue({
      mes: visita.mes,
      visitasHogares: visita.visitasHogares,
      referidasOots: visita.referidasOots,
      visitaHospital: visita.visitaHospital,
      observaciones: visita.observaciones,
      informe_id: visita.informe_id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarVisita(id: number): void {
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
        this.visitaService
          .eliminarVisita(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'La visita ha sido eliminada correctamente', 'success');
              this.cargarVisitas();
              if (this.visitaSeleccionada?.id === id) {
                this.cancelarEdicion();
              }
            },
            error: (error) => {
              this.mostrarErrores('Error', error, 'No se pudo eliminar la visita');
            },
          });
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.visitaSeleccionada = null;
    this.visitaForm.reset();
    const informeId = this.informeService.informeActivoId;
    this.visitaForm.patchValue({ informe_id: informeId });
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

    if (this.editando && this.visitaSeleccionada) {
      // Actualizar visita existente
      const visitaActualizada = { ...informeVisita, id: this.visitaSeleccionada.id };
      this.visitaService
        .actualizarVisita(visitaActualizada)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Visitas', 'Se actualizó el informe de visitas correctamente', 'success');
            this.cargarVisitas();
            this.cancelarEdicion();
          },
          error: (error) => {
            this.mostrarErrores('Visitas', error, 'Error al actualizar el informe de visitas');
          },
        });
    } else {
      // Crear nueva visita
      this.visitaService
        .crearVisita(informeVisita)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Informe de visitas', 'Se registró el informe de visitas correctamente', 'success');
            this.cargarVisitas();
            this.visitaForm.reset();
            const informeId = this.informeService.informeActivoId;
            this.visitaForm.patchValue({ informe_id: informeId });
          },
          error: (error) => {
            this.mostrarErrores('Informe de visitas', error, 'Error al guardar el informe de visitas');
          },
        });
    }
  }

  getNombreMes(mes: number): string {
    return getNombreMes(mes);
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
