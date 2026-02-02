import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LogroModel } from 'src/app/core/models/logro.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { LogroService } from 'src/app/services/logro/logro.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-logros',
  templateUrl: './informe-logros.component.html',
  styleUrls: ['./informe-logros.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
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

  ngOnInit(): void {
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

    this.logroForm = this.formBuilder.group({
      logro: ['', [Validators.required]],
      responsable: [this.usuarioService.usuarioNombre, [Validators.required]],
      observaciones: ['', []],
      informe_id: [informeId, [Validators.required]],
    });

    this.cargarLogros();
  }

  private cargarLogros(): void {
    this.logroService
      .getLogros()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((logros) => {
        this.logros = logros;
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

    this.logroService
      .crearLogro(informeLogro)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          Swal.fire('Logros', 'Se registró el logro correctamente', 'success');
          this.cargarLogros();
          this.logroForm.reset();
          const informeId = this.informeService.informeActivoId;
          this.logroForm.patchValue({ informe_id: informeId, responsable: this.usuarioService.usuarioNombre });
        },
        error: (error) => {
          this.mostrarErrores('Logros', error, 'Error al guardar el logro');
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
