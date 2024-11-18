import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { MinisterioService } from 'src/app/services/ministerio/ministerio.service';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-crear-ministerio',
  templateUrl: './crear-ministerio.component.html',
  styleUrls: ['./crear-ministerio.component.scss'],
})
export class CrearMinisterioComponent implements OnInit {
  ministerioForm: UntypedFormGroup;
  ministerios: MinisterioModel[] = [];

  ministerioSeleccionado: MinisterioModel;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ministerioService: MinisterioService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.resolvers();
  }

  resolvers() {
    this.activatedRoute.data.subscribe((data: { ministerio: MinisterioModel[] }) => {
      this.ministerios = data.ministerio;
      const id = this.activatedRoute.snapshot.params['id'];
      this.buscarMinisterio(id);
    });
  }

  crearFormulario(): void {
    this.ministerioForm = this.formBuilder.group({
      ministerio: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  buscarMinisterio(id: string): void {
    if (id !== 'nuevo') {
      this.ministerioSeleccionado = this.ministerios.find((ministerio) => ministerio.id === Number(id)) || null;
      if (this.ministerioSeleccionado) {
        this.ministerioForm.patchValue({ ministerio: this.ministerioSeleccionado.ministerio });
      }
    }
  }

  crearMinisterio(): void {
    const ministerioNuevo: MinisterioModel = this.ministerioForm.value;

    if (this.ministerioSeleccionado) {
      this.actualizarMinisterio();
    } else {
      this.ministerioService.crearMinisterio(ministerioNuevo).subscribe({
        next: (ministerioCreado: MinisterioModel) => {
          this.mostrarMensaje('Ministerio nuevo', `El ministerio ${ministerioCreado.ministerio} se creó correctamente`);
          this.redirigir();
        },
        error: (error) => this.manejarErrores(error),
      });
    }
  }

  actualizarMinisterio(): void {
    const data: MinisterioModel = {
      ...this.ministerioForm.value,
      id: this.ministerioSeleccionado!.id,
    };

    this.ministerioService.actualizarMinisterio(data).subscribe({
      next: (ministerioActualizado: MinisterioModel) => {
        this.mostrarMensaje(
          'Ministerio Actualizado',
          `El ministerio ${ministerioActualizado.ministerio} se actualizó correctamente`
        );
        this.redirigir();
      },
      error: (error) => this.manejarErrores(error),
    });
  }

  mostrarMensaje(titulo: string, mensaje: string): void {
    Swal.fire({
      title: titulo,
      icon: 'success',
      html: mensaje,
    });
  }

  manejarErrores(error: any): void {
    const errores = error?.error?.errors as { [key: string]: { msg: string } } | undefined;
    const msg = error?.error?.msg || '';

    const listaErrores = errores ? Object.values(errores).map((error) => '° ' + error.msg + '<br>') : [];
    const errorHtml = msg ? `${msg} ${listaErrores.join('')}` : listaErrores.join('');
    this.mostrarMensaje('Error al crear el ministerio', errorHtml);
  }

  redirigir(): void {
    this.router.navigate([RUTAS.SISTEMA, RUTAS.MINISTERIOS]);
  }

  resetFormulario(): void {
    this.ministerioForm.reset();
  }
}
