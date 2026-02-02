import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { InformeService } from 'src/app/services/informe/informe.service';
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
  private usuarioService = inject(UsuarioService);
  private informeService = inject(InformeService);

  public actividadForm: UntypedFormGroup;

  public tipoActividades: TipoActividadModel[] = [];
  // Subscription
  public tipoActividadSubscription: Subscription;

  ngOnInit(): void {
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const nombreUsuario = this.usuarioService.usuarioNombre;
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

    this.actividadForm = this.formBuilder.group({
      fecha: [fechaActual, [Validators.required]],
      tipoActividad_id: ['', [Validators.required]],
      asistencia: ['', [Validators.required]],
      cantidadRecaudada: ['', []],
      responsable: [nombreUsuario, [Validators.required, Validators.minLength(3)]],
      observaciones: ['', []],
      informe_id: [informeId, [Validators.required]],
    });

    this.tipoActividadSubscription = this.tipoActividadService.getTipoActividad().subscribe((tipoActividad) => {
      this.tipoActividades = tipoActividad.filter((actividad: TipoActividadModel) => actividad.estado === true);
    });
  }

  ngOnDestroy(): void {
    this.tipoActividadSubscription?.unsubscribe();
  }

  guardarInformeActividad() {
    if (this.actividadForm.invalid) {
      Swal.fire('Formulario incompleto', 'Por favor complete todos los campos requeridos', 'warning');
      return;
    }

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
      },
    );
  }

  navegarAlInforme() {
    return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }
}
