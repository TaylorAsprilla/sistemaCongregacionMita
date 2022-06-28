import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoActividadModel } from 'src/app/models/tipo-actividad.model';
import { Rutas } from 'src/app/routes/menu-items';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['../informes.css'],
})
export class CrearActividadComponent implements OnInit {
  public tipoActividadForm: FormGroup;

  public tiposActividad: TipoActividadModel[] = [];
  // Subscription
  public tipoActividadSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tipoActividadService: TipoActividadService
  ) {}

  ngOnInit(): void {
    this.tipoActividadForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.cargarTipoActividades();
  }

  cargarTipoActividades() {
    this.tipoActividadSubscription = this.tipoActividadService
      .getTipoActividad()
      .subscribe((tipoActividad: TipoActividadModel[]) => {
        this.tiposActividad = tipoActividad.filter((actividad) => actividad.estado === true);
      });
  }

  crearTipoActividad() {
    console.log('Imprime formulario');

    const tipoActividadNueva = this.tipoActividadForm.value;

    this.tipoActividadService.crearTipoActividad(tipoActividadNueva).subscribe(
      (actividadCreada: any) => {
        console.log(actividadCreada);

        Swal.fire('Tipo de actividad creada', `${actividadCreada.tipoActividadCreado.nombre}`, 'success');
        this.resetFormulario();
        this.cargarTipoActividades();
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al creat el tipo de Actividad',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
        this.router.navigateByUrl(Rutas.INICIO);
      }
    );
  }

  resetFormulario() {
    this.tipoActividadForm.reset();
  }
}
