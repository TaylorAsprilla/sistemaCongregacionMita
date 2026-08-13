import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { MensajeInformativo } from 'src/app/core/interfaces/mensaje-informativo.interface';
import { RUTAS } from 'src/app/routes/menu-items';
import { MensajesInformativosService } from 'src/app/services/mensajes-informativos/mensajes-informativos.service';

// Valida que 'publicar_hasta' no sea menor que 'publicar_desde'
function vigenciaValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const desde = group.get('publicar_desde')?.value;
    const hasta = group.get('publicar_hasta')?.value;

    if (!desde || !hasta) {
      return null;
    }

    return new Date(hasta) < new Date(desde) ? { vigenciaInvalida: true } : null;
  };
}

@Component({
  selector: 'app-crear-mensaje-informativo',
  templateUrl: './crear-mensaje-informativo.component.html',
  styleUrls: ['./crear-mensaje-informativo.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class CrearMensajeInformativoComponent implements OnInit, OnDestroy {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private mensajesInformativosService = inject(MensajesInformativosService);

  public mensajeForm: UntypedFormGroup;
  public mensajeSeleccionado: MensajeInformativo | null = null;
  public guardando = false;

  private paramsSubscription: Subscription;

  readonly tipos = [
    { valor: 'info', etiqueta: 'Información' },
    { valor: 'warning', etiqueta: 'Advertencia' },
    { valor: 'success', etiqueta: 'Éxito' },
    { valor: 'danger', etiqueta: 'Peligro' },
  ];

  ngOnInit(): void {
    this.mensajeForm = this.formBuilder.group(
      {
        titulo: ['', [Validators.required, Validators.minLength(3)]],
        mensaje: ['', [Validators.required, Validators.minLength(3)]],
        tipo: ['info', [Validators.required]],
        activo: [true],
        publicar_desde: ['', [Validators.required]],
        publicar_hasta: ['', [Validators.required]],
        prioridad: [0, [Validators.required, Validators.min(0)]],
      },
      { validators: vigenciaValidator() },
    );

    this.paramsSubscription = this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarMensaje(id);
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

  buscarMensaje(id: string): void {
    if (id === 'nuevo') {
      this.mensajeForm.patchValue({ publicar_desde: this.aFechaLocal(new Date()) });
      return;
    }

    this.mensajesInformativosService.obtenerPorId(Number(id)).subscribe({
      next: (response) => {
        const mensaje = response.mensajeInformativo;
        this.mensajeSeleccionado = mensaje;

        this.mensajeForm.setValue({
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          tipo: mensaje.tipo || 'info',
          activo: mensaje.activo,
          publicar_desde: this.aFechaLocal(mensaje.publicar_desde),
          publicar_hasta: this.aFechaLocal(mensaje.publicar_hasta),
          prioridad: mensaje.prioridad ?? 0,
        });
      },
      error: () => {
        Swal.fire('Error', 'No se encontró el mensaje informativo solicitado', 'error');
        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.MENSAJES_INFORMATIVOS}`);
      },
    });
  }

  guardarMensaje(): void {
    if (this.mensajeForm.invalid) {
      this.mensajeForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const payload: MensajeInformativo = { ...this.mensajeForm.value };

    const peticion = this.mensajeSeleccionado
      ? this.mensajesInformativosService.actualizar(this.mensajeSeleccionado.id as number, payload)
      : this.mensajesInformativosService.crear(payload);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire(
          'Listo',
          `El mensaje informativo fue ${this.mensajeSeleccionado ? 'actualizado' : 'creado'} correctamente`,
          'success',
        );
        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.MENSAJES_INFORMATIVOS}`);
      },
      error: (error) => {
        this.guardando = false;
        const errores = error.error?.errors;
        const listaErrores = errores
          ? Object.values(errores)
              .map((err: any) => `° ${err.msg}<br>`)
              .join('')
          : error.error?.msg || 'Ocurrió un error inesperado';

        Swal.fire({
          title: `Error al ${this.mensajeSeleccionado ? 'actualizar' : 'crear'} el mensaje`,
          icon: 'error',
          html: `${listaErrores}`,
        });
      },
    });
  }

  cancelar(): void {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.MENSAJES_INFORMATIVOS}`);
  }

  private aFechaLocal(fecha: string | Date): string {
    const date = new Date(fecha);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }
}
