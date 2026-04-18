import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsuntoPendienteModel, TipoAsunto } from 'src/app/core/models/asunto-pendiente.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { AsuntoPendienteService } from 'src/app/services/asunto-pendiente/asunto-pendiente.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-asunto-pendiente',
  templateUrl: './informe-asunto-pendiente.component.html',
  styleUrls: ['./informe-asunto-pendiente.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class InformeAsuntoPendienteComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private asuntoPendienteService = inject(AsuntoPendienteService);
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);

  public asuntoForm: UntypedFormGroup;

  public asuntos: AsuntoPendienteModel[] = [];
  public editando: boolean = false;
  public asuntoSeleccionado: AsuntoPendienteModel | null = null;

  public readonly tiposAsunto: TipoAsunto[] = ['Administrativo', 'Eclesiastico', 'Actividades'];

  constructor() {
    const informeId = this.informeService.informeActivoId;
    const nombreUsuario = this.usuarioService.usuarioNombre;

    if (!informeId) {
      Swal.fire({
        title: 'Sin informe activo',
        text: 'No hay un informe activo. Por favor, genera un informe primero.',
        icon: 'warning',
        confirmButtonText: 'Ir a Informes',
      }).then(() => this.navegarAlInforme());
      return;
    }

    this.asuntoForm = this.formBuilder.group({
      tipo: ['', [Validators.required]],
      asunto: ['', [Validators.required]],
      responsable: [nombreUsuario, [Validators.required]],
      observaciones: ['', []],
      informe_id: [informeId, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarAsuntos();
  }

  private cargarAsuntos(): void {
    const informeId = this.informeService.informeActivoId;
    if (!informeId) return;

    this.asuntoPendienteService
      .getAsuntosPendientes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((asuntos) => {
        this.asuntos = asuntos.filter((a: AsuntoPendienteModel) => a.informe_id === informeId && a.estado !== false);
      });
  }

  guardarAsunto(): void {
    if (this.asuntoForm.invalid) {
      this.asuntoForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'warning',
      });
      return;
    }

    const datos = this.asuntoForm.value;

    if (this.editando && this.asuntoSeleccionado) {
      const actualizado = { ...datos, id: this.asuntoSeleccionado.id };
      this.asuntoPendienteService
        .actualizarAsuntoPendiente(actualizado)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Asuntos Pendientes', 'Se actualizó el registro correctamente', 'success');
            this.cargarAsuntos();
            this.cancelarEdicion();
          },
          error: (error) => this.mostrarErrores('Asuntos Pendientes', error, 'Error al actualizar'),
        });
    } else {
      this.asuntoPendienteService
        .crearAsuntoPendiente(datos)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Asuntos Pendientes', 'Se registró correctamente', 'success');
            this.cargarAsuntos();
            const informeId = this.informeService.informeActivoId;
            this.asuntoForm.reset();
            this.asuntoForm.patchValue({
              informe_id: informeId,
              responsable: this.usuarioService.usuarioNombre,
            });
          },
          error: (error) => this.mostrarErrores('Asuntos Pendientes', error, 'Error al guardar'),
        });
    }
  }

  editarAsunto(asunto: AsuntoPendienteModel): void {
    this.editando = true;
    this.asuntoSeleccionado = asunto;
    this.asuntoForm.patchValue({
      tipo: asunto.tipo,
      asunto: asunto.asunto,
      responsable: asunto.responsable,
      observaciones: asunto.observaciones,
      informe_id: asunto.informe_id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarAsunto(id: number): void {
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
        this.asuntoPendienteService
          .eliminarAsuntoPendiente(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'El registro ha sido eliminado', 'success');
              this.cargarAsuntos();
              if (this.asuntoSeleccionado?.id === id) this.cancelarEdicion();
            },
            error: (error) => this.mostrarErrores('Error', error, 'No se pudo eliminar'),
          });
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.asuntoSeleccionado = null;
    const informeId = this.informeService.informeActivoId;
    this.asuntoForm.reset();
    this.asuntoForm.patchValue({ informe_id: informeId });
  }

  navegarAlInforme(): void {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }

  private mostrarErrores(titulo: string, error: any, mensajeExtra: string = ''): void {
    const errores = error?.error?.errors as { [key: string]: { msg: string } };
    if (!errores) {
      Swal.fire({ title: titulo, text: mensajeExtra || 'Ocurrió un error inesperado', icon: 'error' });
      return;
    }
    const lista = Object.values(errores).map((e) => `° ${e.msg}<br>`);
    Swal.fire({ title: titulo, icon: 'error', html: lista.join('') });
  }
}
