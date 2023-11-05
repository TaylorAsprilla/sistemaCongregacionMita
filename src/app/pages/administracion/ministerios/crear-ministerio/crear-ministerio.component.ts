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

  crearFormulario() {
    this.ministerioForm = this.formBuilder.group({
      ministerio: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  buscarMinisterio(id: string) {
    if (id !== 'nuevo') {
      this.ministerioSeleccionado = this.ministerios.find((ministerio) => ministerio.id === Number(id));
      if (this.ministerioSeleccionado) {
        this.ministerioForm.patchValue({ ministerio: this.ministerioSeleccionado.ministerio });
      }
    }
  }

  crearMinisterio() {
    const ministerioNuevo = this.ministerioForm.value;

    if (this.ministerioSeleccionado) {
      this.actualizarMinisterio();
    } else {
      this.ministerioService.crearMinisterio(ministerioNuevo).subscribe(
        (ministerioCreado: any) => {
          this.mostrarMensaje(
            'Ministerio nuevo',
            `El ministerio ${ministerioCreado.ministerioCreado.ministerio} se creó correctamente`
          );
          this.redirigir();
        },
        (error) => {
          this.manejarErrores(error);
        }
      );
    }
  }

  actualizarMinisterio() {
    const data = {
      ...this.ministerioForm.value,
      id: this.ministerioSeleccionado.id,
    };

    this.ministerioService.actualizarMinisterio(data).subscribe((ministerio: any) => {
      this.mostrarMensaje(
        'Ministerio Actualizado',
        `El ministerio ${ministerio.ministerioActualizado.ministerio} se actualizó correctamente`
      );
      this.redirigir();
    });
  }

  mostrarMensaje(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      icon: 'success',
      html: mensaje,
    });
  }

  manejarErrores(error) {
    const errores = error.error.errors;
    const msg = error.error.msg || '';
    const listaErrores = errores ? Object.entries(errores).map(([key, value]) => '° ' + value['msg'] + '<br>') : [];
    const errorHtml = msg ? `${msg} ${listaErrores.join('')}` : listaErrores.join('');
    this.mostrarMensaje('Error al crear el ministerio', errorHtml);
  }

  redirigir() {
    this.router.navigate([RUTAS.SISTEMA, RUTAS.MINISTERIOS]);
  }

  resetFormulario() {
    this.ministerioForm.reset();
  }
}
