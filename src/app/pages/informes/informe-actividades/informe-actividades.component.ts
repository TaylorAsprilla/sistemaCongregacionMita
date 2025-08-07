import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informes-actividades',
  templateUrl: './informe-actividades.component.html',
  styleUrls: ['./informe-actividades.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class InformeActividadesComponent implements OnInit, OnDestroy {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private tipoActividadService = inject(TipoActividadService);
  private actividadService = inject(ActividadService);

  public actividadForm: UntypedFormGroup;

  public tipoActividades: TipoActividadModel[] = [];
  // Subscription
  public tipoActividadSubscription: Subscription;

  ngOnInit(): void {
    this.actividadForm = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      cantidadRecaudada: ['', []],
      responsable: ['', [Validators.required, Validators.minLength(3)]],
      asistencia: ['', [Validators.required]],
      tipoActividad_id: ['', [Validators.required]],
      observaciones: ['', []],
      informe_id: ['1', [Validators.required]],
    });

    this.tipoActividadSubscription = this.tipoActividadService.getTipoActividad().subscribe((tipoActividad) => {
      this.tipoActividades = tipoActividad.filter((actividad: TipoActividadModel) => actividad.estado === true);
    });
  }

  ngOnDestroy(): void {
    this.tipoActividadSubscription?.unsubscribe();
  }

  guardarInformeActividad() {
    const informeActividad = this.actividadForm.value;

    this.actividadService.crearActividad(informeActividad).subscribe(
      (actividadCreada: any) => {
        Swal.fire('Informe de actividades', 'Se registró el informe de actividades correctamente', 'success');
        this.navegarAlInforme();
      },
      (error) => {
        const errores = error.error.errors as { [key: string]: { msg: string } };
        const listaErrores: string[] = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Actividad',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
        this.navegarAlInforme();
      }
    );
  }

  navegarAlInforme() {
    return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }
}
