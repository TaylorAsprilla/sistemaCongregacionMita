import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AspectoEspiritualModel } from 'src/app/core/models/aspecto-espiritual.model';
import { CategoriaActividadEspiritualModel } from 'src/app/core/models/categoria-actividad-espiritual.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { AspectoEspiritualService } from 'src/app/services/aspecto-espiritual/aspecto-espiritual.service';
import { CategoriaActividadEspiritualService } from 'src/app/services/categoria-actividad-espiritual/categoria-actividad-espiritual.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-aspecto-espiritual',
  templateUrl: './informe-aspecto-espiritual.component.html',
  styleUrls: ['./informe-aspecto-espiritual.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
})
export class InformeAspectoEspiritualComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private aspectoEspiritualService = inject(AspectoEspiritualService);
  private categoriaService = inject(CategoriaActividadEspiritualService);
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);

  public aspectoForm: UntypedFormGroup;

  public aspectos: AspectoEspiritualModel[] = [];
  public categorias: CategoriaActividadEspiritualModel[] = [];
  public editando: boolean = false;
  public aspectoSeleccionado: AspectoEspiritualModel | null = null;

  constructor() {
    const nombreUsuario = this.usuarioService.usuarioNombre;
    const informeId = this.informeService.informeActivoId;

    if (!informeId) {
      Swal.fire({
        title: 'Sin informe activo',
        text: 'No hay un informe activo. Por favor, genera un informe primero.',
        icon: 'warning',
        confirmButtonText: 'Ir a Informes',
      }).then(() => this.navegarAlInforme());
      return;
    }

    this.aspectoForm = this.formBuilder.group({
      categoria_id: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      observaciones: ['', [Validators.required]],
      responsable: [nombreUsuario, [Validators.required]],
      informe_id: [informeId, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarAspectos();
  }

  private cargarCategorias(): void {
    this.categoriaService
      .getCategorias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categorias) => {
        this.categorias = categorias.filter((c) => c.estado !== false);
      });
  }

  private cargarAspectos(): void {
    const informeId = this.informeService.informeActivoId;
    if (!informeId) return;

    this.aspectoEspiritualService
      .getAspectosEspiritualesByInforme(informeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((aspectos) => {
        this.aspectos = aspectos;
      });
  }

  getNombreCategoria(aspecto: AspectoEspiritualModel): string {
    return (
      aspecto.categoria?.nombre ??
      this.categorias.find((c) => c.id === aspecto.categoria_id)?.nombre ??
      `Categoría #${aspecto.categoria_id}`
    );
  }

  guardarAspecto(): void {
    if (this.aspectoForm.invalid) {
      this.aspectoForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'warning',
      });
      return;
    }

    const datos = this.aspectoForm.value;

    if (this.editando && this.aspectoSeleccionado) {
      const { categoria_id, fecha, observaciones, responsable } = datos;
      this.aspectoEspiritualService
        .actualizarAspectoEspiritual(this.aspectoSeleccionado.id, { categoria_id, fecha, observaciones, responsable })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Aspecto Espiritual', 'Se actualizó el registro correctamente', 'success');
            this.cargarAspectos();
            this.cancelarEdicion();
          },
          error: (error) => this.mostrarErrores('Aspecto Espiritual', error, 'Error al actualizar'),
        });
    } else {
      this.aspectoEspiritualService
        .crearAspectoEspiritual(datos)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Aspecto Espiritual', 'Se registró correctamente', 'success');
            this.cargarAspectos();
            const informeId = this.informeService.informeActivoId;
            this.aspectoForm.reset();
            this.aspectoForm.patchValue({
              informe_id: informeId,
              responsable: this.usuarioService.usuarioNombre,
            });
          },
          error: (error) => this.mostrarErrores('Aspecto Espiritual', error, 'Error al guardar'),
        });
    }
  }

  editarAspecto(aspecto: AspectoEspiritualModel): void {
    this.editando = true;
    this.aspectoSeleccionado = aspecto;
    this.aspectoForm.patchValue({
      categoria_id: aspecto.categoria_id,
      fecha: aspecto.fecha ?? '',
      observaciones: aspecto.observaciones,
      responsable: aspecto.responsable,
      informe_id: aspecto.informe_id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarAspecto(id: number): void {
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
        this.aspectoEspiritualService
          .eliminarAspectoEspiritual(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'El registro ha sido eliminado', 'success');
              this.cargarAspectos();
              if (this.aspectoSeleccionado?.id === id) this.cancelarEdicion();
            },
            error: (error) => this.mostrarErrores('Error', error, 'No se pudo eliminar'),
          });
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.aspectoSeleccionado = null;
    const informeId = this.informeService.informeActivoId;
    this.aspectoForm.reset();
    this.aspectoForm.patchValue({ informe_id: informeId });
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
