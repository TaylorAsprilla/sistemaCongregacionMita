import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import { ActividadModel } from 'src/app/core/models/actividad.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informes-actividades',
  templateUrl: './informe-actividades.component.html',
  styleUrls: ['./informe-actividades.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
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
  public actividades: ActividadModel[] = [];
  public editando: boolean = false;
  public actividadSeleccionada: ActividadModel | null = null;
  public fechaMinima: string;
  public fechaMaxima: string;

  // Subscription
  public tipoActividadSubscription: Subscription;
  public actividadSubscription: Subscription;

  ngOnInit(): void {
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
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

    this.actividadForm = this.formBuilder.group({
      fecha: [fechaActual, [Validators.required]],
      tipoActividad_id: ['', [Validators.required]],
      asistencia: ['', [Validators.required]],
      responsable: [nombreUsuario, [Validators.required, Validators.minLength(3)]],
      observaciones: ['', []],
      informe_id: [informeId, [Validators.required]],
    });

    this.tipoActividadSubscription = this.tipoActividadService.getTipoActividad().subscribe((tipoActividad) => {
      this.tipoActividades = tipoActividad.filter((actividad: TipoActividadModel) => actividad.estado === true);
    });

    this.cargarActividades();
  }

  ngOnDestroy(): void {
    this.tipoActividadSubscription?.unsubscribe();
    this.actividadSubscription?.unsubscribe();
  }

  cargarActividades() {
    const informeId = this.informeService.informeActivoId;
    if (!informeId) return;

    this.actividadSubscription = this.actividadService.getActividad().subscribe((actividades) => {
      this.actividades = actividades.filter((act: ActividadModel) => act.informe_id === informeId);
    });
  }

  guardarInformeActividad() {
    if (this.actividadForm.invalid) {
      Swal.fire('Formulario incompleto', 'Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    const informeActividad = this.actividadForm.value;

    if (this.editando && this.actividadSeleccionada) {
      this.actividadService.actualizarActividad({ ...informeActividad, id: this.actividadSeleccionada.id }).subscribe(
        () => {
          Swal.fire('Actividad actualizada', 'La actividad se actualizó correctamente', 'success');
          this.cargarActividades();
          this.cancelarEdicion();
        },
        (error) => {
          this.mostrarError(error);
        },
      );
    } else {
      this.actividadService.crearActividad(informeActividad).subscribe(
        () => {
          Swal.fire('Actividad creada', 'Se registró la actividad correctamente', 'success');
          this.cargarActividades();
          this.actividadForm.reset({
            fecha: new Date().toISOString().split('T')[0],
            responsable: this.usuarioService.usuarioNombre,
            informe_id: this.informeService.informeActivoId,
            tipoActividad_id: '',
            asistencia: '',
            cantidadRecaudada: '',
            observaciones: '',
          });
        },
        (error) => {
          this.mostrarError(error);
        },
      );
    }
  }

  editarActividad(actividad: ActividadModel) {
    this.editando = true;
    this.actividadSeleccionada = actividad;
    this.actividadForm.patchValue({
      fecha: actividad.fecha,
      tipoActividad_id: actividad.tipoActividad_id,
      asistencia: actividad.asistencia,
      responsable: actividad.responsable,
      observaciones: actividad.observaciones,
      informe_id: actividad.informe_id,
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.actividadSeleccionada = null;
    this.actividadForm.reset({
      fecha: new Date().toISOString().split('T')[0],
      responsable: this.usuarioService.usuarioNombre,
      informe_id: this.informeService.informeActivoId,
      tipoActividad_id: '',
      asistencia: '',
      cantidadRecaudada: '',
      observaciones: '',
    });
  }

  eliminarActividad(actividad: ActividadModel) {
    Swal.fire({
      title: '¿Eliminar actividad?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actividadService.eliminarActividad(actividad.id!).subscribe(
          () => {
            Swal.fire('Eliminada', 'La actividad ha sido eliminada', 'success');
            this.cargarActividades();
          },
          (error) => {
            this.mostrarError(error);
          },
        );
      }
    });
  }

  getNombreTipoActividad(id: number): string {
    const tipo = this.tipoActividades.find((t) => t.id === id);
    return tipo ? tipo.nombre : 'N/A';
  }

  mostrarError(error: any) {
    const errores = error.error?.errors as { [key: string]: { msg: string } };
    const listaErrores: string[] = [];

    if (errores) {
      Object.entries(errores).forEach(([key, value]) => {
        listaErrores.push('° ' + value['msg'] + '<br>');
      });
    }

    Swal.fire({
      title: 'Error',
      icon: 'error',
      html: listaErrores.length > 0 ? listaErrores.join('') : 'Ocurrió un error al procesar la solicitud',
    });
  }

  obtenerFechasTrimestreActual(): { min: string; max: string } {
    const hoy = new Date();
    const mesActual = hoy.getMonth(); // 0-11
    const anioActual = hoy.getFullYear();

    // Calcular el trimestre (0-3)
    const trimestre = Math.floor(mesActual / 3);
    const primerMesTrimestre = trimestre * 3; // 0, 3, 6, 9
    const ultimoMesTrimestre = primerMesTrimestre + 2; // 2, 5, 8, 11

    // Fecha mínima: primer día del primer mes del trimestre
    const fechaMin = new Date(anioActual, primerMesTrimestre, 1);

    // Fecha máxima: último día del último mes del trimestre
    const fechaMax = new Date(anioActual, ultimoMesTrimestre + 1, 0);

    return {
      min: fechaMin.toISOString().split('T')[0],
      max: fechaMax.toISOString().split('T')[0],
    };
  }

  navegarAlInforme() {
    return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }
}
