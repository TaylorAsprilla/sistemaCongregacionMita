import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { EstatusModel } from 'src/app/core/models/estatus.model';
import { MetaModel } from 'src/app/core/models/meta.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { EstatusService } from 'src/app/services/estatus/estatus.service';
import { MetaService } from 'src/app/services/meta/meta.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-metas',
  templateUrl: './informe-metas.component.html',
  styleUrls: ['./informe-metas.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class InformeMetasComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private estatusService = inject(EstatusService);
  private metaService = inject(MetaService);
  private informeService = inject(InformeService);

  public metaForm: UntypedFormGroup;

  public estatus: EstatusModel[] = [];

  public metas: MetaModel[] = [];

  public editando: boolean = false;
  public metaSeleccionada: MetaModel | null = null;

  ngOnInit(): void {
    const informeId = this.informeService.informeActivoId;
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY

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

    this.metaForm = this.formBuilder.group({
      meta: ['', [Validators.required]],
      fecha: [fechaActual, [Validators.required]],
      accion: ['', []],
      comentarios: ['', []],
      informe_id: [informeId, [Validators.required]],
      tipoStatus_id: ['', [Validators.required]],
    });

    this.cargarEstatus();
    this.cargarMetas();
  }

  private cargarEstatus(): void {
    this.estatusService
      .getEstatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((estatus) => {
        this.estatus = estatus.filter((e) => e.estado === true);
      });
  }

  private cargarMetas(): void {
    const informeId = this.informeService.informeActivoId;
    if (!informeId) return;

    this.metaService
      .getMetas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((metas) => {
        this.metas = metas.filter((meta: MetaModel) => meta.informe_id === informeId && meta.estado !== false);
      });
  }

  editarMeta(meta: MetaModel): void {
    this.editando = true;
    this.metaSeleccionada = meta;
    this.metaForm.patchValue({
      meta: meta.meta,
      fecha: meta.fecha,
      accion: meta.accion,
      tipoStatus_id: meta.tipoStatus_id,
      comentarios: meta.comentarios,
      informe_id: meta.informe_id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarMeta(id: number): void {
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
        this.metaService
          .eliminarMeta(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'La meta ha sido eliminada correctamente', 'success');
              this.cargarMetas();
              if (this.metaSeleccionada?.id === id) {
                this.cancelarEdicion();
              }
            },
            error: (error) => {
              this.mostrarErrores('Error', error, 'No se pudo eliminar la meta');
            },
          });
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.metaSeleccionada = null;
    this.metaForm.reset();
    const informeId = this.informeService.informeActivoId;
    const fechaActual = new Date().toISOString().split('T')[0];
    this.metaForm.patchValue({ fecha: fechaActual, informe_id: informeId });
  }

  guardarMeta(): void {
    if (this.metaForm.invalid) {
      this.metaForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'warning',
      });
      return;
    }

    const informeMeta = this.metaForm.value;

    if (this.editando && this.metaSeleccionada) {
      // Actualizar meta existente
      const metaActualizada = { ...informeMeta, id: this.metaSeleccionada.id };
      this.metaService
        .actualizarMeta(metaActualizada)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Metas', 'Se actualizó la meta correctamente', 'success');
            this.cargarMetas();
            this.cancelarEdicion();
          },
          error: (error) => {
            this.mostrarErrores('Metas', error, 'Error al actualizar la meta');
          },
        });
    } else {
      // Crear nueva meta
      this.metaService
        .crearMeta(informeMeta)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Informe de metas', 'Se registró la meta correctamente', 'success');
            this.cargarMetas();
            this.metaForm.reset();
            const informeId = this.informeService.informeActivoId;
            const fechaActual = new Date().toISOString().split('T')[0];
            this.metaForm.patchValue({ fecha: fechaActual, informe_id: informeId });
          },
          error: (error) => {
            this.mostrarErrores('Informe de metas', error, 'Error al guardar el informe de metas');
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
