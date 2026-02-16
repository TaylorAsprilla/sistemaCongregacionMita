import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActividadEconomicaModel } from 'src/app/core/models/actividad-economica.model';
import { TipoActividadEconomicaModel } from 'src/app/core/models/tipo-actividad-economica.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { ActividadEconomicaService } from 'src/app/services/actividad-economica/actividad-economica.service';
import { TipoActividadEconomicaService } from 'src/app/services/tipo-actividad-economica/tipo-actividad-economica.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividad-economica',
  templateUrl: './actividad-economica.component.html',
  styleUrls: ['./actividad-economica.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DatePipe, CurrencyPipe],
})
export class ActividadEconomicaComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private actividadEconomicaService = inject(ActividadEconomicaService);
  private tipoActividadEconomicaService = inject(TipoActividadEconomicaService);
  private usuarioService = inject(UsuarioService);
  private informeService = inject(InformeService);

  public actividadEconomicaForm: FormGroup;
  public actividadesEconomicas: ActividadEconomicaModel[] = [];
  public tiposActividadEconomica: TipoActividadEconomicaModel[] = [];
  public editando: boolean = false;
  public actividadSeleccionada: ActividadEconomicaModel | null = null;
  public fechaMinima: string;
  public fechaMaxima: string;

  // Subscription
  public actividadEconomicaSubscription: Subscription;
  public tipoActividadEconomicaSubscription: Subscription;

  ngOnInit(): void {
    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreUsuario = this.usuarioService.usuarioNombre;
    const informeId = this.informeService.informeActivoId;

    // Calcular fechas del trimestre actual
    const fechasTrimestre = this.obtenerFechasTrimestreActual();
    this.fechaMinima = fechasTrimestre.min;
    this.fechaMaxima = fechasTrimestre.max;

    this.actividadEconomicaForm = this.formBuilder.group({
      fecha: [fechaActual, [Validators.required]],
      cantidadRecaudada: ['', [Validators.required, Validators.min(0)]],
      responsable: [nombreUsuario, [Validators.required, Validators.minLength(3)]],
      asistencia: ['', [Validators.required, Validators.min(0)]],
      observaciones: [''],
      informe_id: [informeId, [Validators.required]],
      tipoActividadEconomica_id: ['', [Validators.required]],
    });

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

    this.cargarTiposActividadEconomica();
    this.cargarActividadesEconomicas();
  }

  ngOnDestroy(): void {
    this.actividadEconomicaSubscription?.unsubscribe();
    this.tipoActividadEconomicaSubscription?.unsubscribe();
  }

  cargarTiposActividadEconomica() {
    this.tipoActividadEconomicaSubscription = this.tipoActividadEconomicaService
      .getTipoActividadEconomica()
      .subscribe((tiposActividad: TipoActividadEconomicaModel[]) => {
        this.tiposActividadEconomica = tiposActividad.filter((tipo) => tipo.estado === true);
      });
  }

  cargarActividadesEconomicas() {
    this.actividadEconomicaSubscription = this.actividadEconomicaService
      .getActividadEconomica()
      .subscribe((actividadesEconomicas: ActividadEconomicaModel[]) => {
        this.actividadesEconomicas = actividadesEconomicas;
      });
  }

  crearActividadEconomica() {
    if (this.editando && this.actividadSeleccionada) {
      this.actualizarActividad();
      return;
    }

    const actividadEconomicaNueva = this.actividadEconomicaForm.value;

    this.actividadEconomicaService.crearActividadEconomica(actividadEconomicaNueva).subscribe(
      (actividadCreada: any) => {
        Swal.fire('Actividad económica creada', 'La actividad ha sido registrada exitosamente', 'success');
        this.resetFormulario();
        this.cargarActividadesEconomicas();
      },
      (error) => {
        const errores = error.error.errors as { [key: string]: { msg: string } };
        const listaErrores: string[] = [];

        if (errores) {
          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });
        }

        Swal.fire({
          title: 'Error al crear la Actividad Económica',
          icon: 'error',
          html: listaErrores.length > 0 ? `${listaErrores.join('')}` : error.error?.msg || 'Ocurrió un error',
        });
      },
    );
  }

  editarActividad(actividad: ActividadEconomicaModel) {
    this.editando = true;
    this.actividadSeleccionada = actividad;
    this.actividadEconomicaForm.patchValue({
      fecha: actividad.fecha,
      cantidadRecaudada: actividad.cantidadRecaudada,
      responsable: actividad.responsable,
      asistencia: actividad.asistencia,
      observaciones: actividad.observaciones,
      informe_id: actividad.informe_id,
      tipoActividadEconomica_id: actividad.tipoActividadEconomica_id,
    });
  }

  actualizarActividad() {
    const actividadEconomicaActualizada = {
      ...this.actividadSeleccionada,
      ...this.actividadEconomicaForm.value,
    };

    this.actividadEconomicaService.actualizarActividadEconomica(actividadEconomicaActualizada).subscribe(
      (actividadActualizada: any) => {
        Swal.fire('Actividad económica actualizada', 'La actividad ha sido actualizada exitosamente', 'success');
        this.resetFormulario();
        this.cargarActividadesEconomicas();
      },
      (error) => {
        Swal.fire({
          title: 'Error al actualizar la Actividad Económica',
          icon: 'error',
          text: error.error?.msg || 'Ocurrió un error inesperado',
        });
      },
    );
  }

  eliminarActividad(actividad: ActividadEconomicaModel) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar la actividad económica del ${actividad.fecha}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actividadEconomicaService.eliminarActividadEconomica(actividad).subscribe(
          () => {
            Swal.fire('Eliminada', 'La actividad económica ha sido eliminada', 'success');
            this.cargarActividadesEconomicas();
          },
          (error) => {
            Swal.fire({
              title: 'Error al eliminar',
              icon: 'error',
              text: error.error?.msg || 'Ocurrió un error inesperado',
            });
          },
        );
      }
    });
  }

  getNombreTipoActividad(tipoActividadEconomica_id: number): string {
    const tipo = this.tiposActividadEconomica.find((t) => t.id === tipoActividadEconomica_id);
    return tipo ? tipo.nombre : 'N/A';
  }

  cancelarEdicion() {
    this.resetFormulario();
  }

  navegarAlInforme() {
    return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }

  resetFormulario() {
    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreUsuario = this.usuarioService.usuarioNombre;
    const informeId = this.informeService.informeActivoId;

    this.actividadEconomicaForm.reset({
      fecha: fechaActual,
      cantidadRecaudada: 0,
      responsable: nombreUsuario,
      asistencia: 0,
      informe_id: informeId,
    });
    this.editando = false;
    this.actividadSeleccionada = null;
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
}
