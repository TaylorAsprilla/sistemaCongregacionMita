import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LogroModel } from 'src/app/core/models/logro.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { LogroService } from 'src/app/services/logro/logro.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-logros',
  templateUrl: './informe-logros.component.html',
  styleUrls: ['./informe-logros.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
})
export class InformeLogrosComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private logroService = inject(LogroService);
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);

  public logroForm: UntypedFormGroup;

  public logros: LogroModel[] = [];
  public editando: boolean = false;
  public logroSeleccionado: LogroModel | null = null;
  public fechaMinima: string;
  public fechaMaxima: string;

  constructor() {
    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreUsuario = this.usuarioService.usuarioNombre;
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

    this.logroForm = this.formBuilder.group({
      fecha: [fechaActual, [Validators.required]],
      logro: ['', [Validators.required]],
      responsable: [nombreUsuario, [Validators.required]],
      comentarios: ['', []],
      informe_id: [informeId, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarLogros();
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

  private cargarLogros(): void {
    const informeId = this.informeService.informeActivoId;
    if (!informeId) return;

    this.logroService
      .getLogros()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((logros) => {
        this.logros = logros.filter((logro: LogroModel) => logro.informe_id === informeId && logro.estado !== false);
      });
  }

  guardarLogro(): void {
    if (this.logroForm.invalid) {
      this.logroForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'warning',
      });
      return;
    }

    const informeLogro = this.logroForm.value;

    if (this.editando && this.logroSeleccionado) {
      // Actualizar logro existente
      const logroActualizado = { ...informeLogro, id: this.logroSeleccionado.id };
      this.logroService
        .actualizarLogro(logroActualizado)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Logros', 'Se actualizó el logro correctamente', 'success');
            this.cargarLogros();
            this.cancelarEdicion();
          },
          error: (error) => {
            this.mostrarErrores('Logros', error, 'Error al actualizar el logro');
          },
        });
    } else {
      // Crear nuevo logro
      this.logroService
        .crearLogro(informeLogro)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            Swal.fire('Logros', 'Se registró el logro correctamente', 'success');
            this.cargarLogros();
            this.logroForm.reset();
            const informeId = this.informeService.informeActivoId;
            const fechaActual = new Date().toISOString().split('T')[0];
            this.logroForm.patchValue({
              informe_id: informeId,
              responsable: this.usuarioService.usuarioNombre,
              fecha: fechaActual,
            });
          },
          error: (error) => {
            this.mostrarErrores('Logros', error, 'Error al guardar el logro');
          },
        });
    }
  }

  editarLogro(logro: LogroModel): void {
    this.editando = true;
    this.logroSeleccionado = logro;
    this.logroForm.patchValue({
      fecha: logro.fecha,
      logro: logro.logro,
      responsable: logro.responsable,
      comentarios: logro.comentarios,
      informe_id: logro.informe_id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarLogro(id: number): void {
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
        this.logroService
          .eliminarLogro(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'El logro ha sido eliminado correctamente', 'success');
              this.cargarLogros();
              if (this.logroSeleccionado?.id === id) {
                this.cancelarEdicion();
              }
            },
            error: (error) => {
              this.mostrarErrores('Error', error, 'No se pudo eliminar el logro');
            },
          });
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.logroSeleccionado = null;
    this.logroForm.reset();
    const informeId = this.informeService.informeActivoId;
    const fechaActual = new Date().toISOString().split('T')[0];
    this.logroForm.patchValue({
      informe_id: informeId,
      responsable: this.usuarioService.usuarioNombre,
      fecha: fechaActual,
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
