import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoActividadModel } from 'src/app/models/tipo-actividad.model';
import { Rutas } from 'src/app/routes/menu-items';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informes-actividades',
  templateUrl: './informe-actividades.component.html',
  styleUrls: ['./informe-actividades.component.scss'],
})
export class InformeActividadesComponent implements OnInit, OnDestroy {
  public actividadForm: FormGroup;

  public tipoActividades: TipoActividadModel[] = [];
  // Subscription
  public tipoActividadSubscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tipoActividadService: TipoActividadService,
    private actividadService: ActividadService
  ) {}

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
        this.router.navigateByUrl(Rutas.INFORME);
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Actividad',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
        this.router.navigateByUrl(Rutas.INICIO);
      }
    );
  }
}
