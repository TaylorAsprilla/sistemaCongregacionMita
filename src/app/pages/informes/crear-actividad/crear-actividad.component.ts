import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SeccionInformeModel } from 'src/app/core/models/seccion-informe.model';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class CrearActividadComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private tipoActividadService = inject(TipoActividadService);
  private activatedRoute = inject(ActivatedRoute);

  public tipoActividadForm: FormGroup;

  public tiposActividad: TipoActividadModel[] = [];
  public seccionesInformes: SeccionInformeModel[] = [];
  // Subscription
  public tipoActividadSubscription: Subscription;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { seccionInforme: SeccionInformeModel[] }) => {
      this.seccionesInformes = data.seccionInforme;
    });

    this.tipoActividadForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      idSeccion: ['', [Validators.required]],
    });

    this.cargarTipoActividades();
  }

  ngOnDestroy(): void {
    this.tipoActividadSubscription?.unsubscribe();
  }

  cargarTipoActividades() {
    this.tipoActividadSubscription = this.tipoActividadService
      .getTipoActividad()
      .subscribe((tipoActividad: TipoActividadModel[]) => {
        this.tiposActividad = tipoActividad.filter((actividad) => actividad.estado === true);
      });
  }

  crearTipoActividad() {
    const tipoActividadNueva = this.tipoActividadForm.value;

    this.tipoActividadService.crearTipoActividad(tipoActividadNueva).subscribe(
      (actividadCreada: any) => {
        Swal.fire('Tipo de actividad creada', `${actividadCreada.tipoActividadCreado.nombre}`, 'success');
        this.resetFormulario();
        this.cargarTipoActividades();
      },
      (error) => {
        const errores = error.error.errors as { [key: string]: { msg: string } };
        const listaErrores: string[] = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al creat el tipo de Actividad',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
        this.router.navigateByUrl(RUTAS.INICIO);
      }
    );
  }

  resetFormulario() {
    this.tipoActividadForm.reset();
  }
}
