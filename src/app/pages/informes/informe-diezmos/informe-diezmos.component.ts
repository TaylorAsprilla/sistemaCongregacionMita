import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DiezmoModel } from 'src/app/core/models/diezmo.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { DiezmoService } from 'src/app/services/diezmo/diezmo.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { CurrencyPipe } from '@angular/common';
import { MESES, MesItem, getNombreMes, obtenerMesesTrimestreActual } from 'src/app/core/constants/meses.constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-diezmos',
  templateUrl: './informe-diezmos.component.html',
  styleUrls: ['./informe-diezmos.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CurrencyPipe],
})
export class InformeDiezmosComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private diezmoService = inject(DiezmoService);
  private informeService = inject(InformeService);

  public diezmoForm: FormGroup;
  public diezmos: DiezmoModel[] = [];
  public editando: boolean = false;
  public diezmoSeleccionado: DiezmoModel | null = null;

  public readonly todosMeses = MESES;
  public meses: MesItem[] = [];

  // Subscription
  public diezmoSubscription: Subscription;

  constructor() {
    const informeId = this.informeService.informeActivoId;

    // Calcular trimestre actual y filtrar meses
    this.meses = obtenerMesesTrimestreActual();

    this.diezmoForm = this.formBuilder.group({
      sobresRestrictos: ['', [Validators.required, Validators.min(0)]],
      sobresNoRestrictos: ['', [Validators.required, Validators.min(0)]],
      restrictos: ['', [Validators.required, Validators.min(0)]],
      noRestrictos: ['', [Validators.required, Validators.min(0)]],
      mes: ['', [Validators.required]],
      informe_id: [informeId, [Validators.required]],
    });
  }

  ngOnInit(): void {
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

    this.cargarDiezmos();
  }

  ngOnDestroy(): void {
    this.diezmoSubscription?.unsubscribe();
  }

  cargarDiezmos() {
    const informeId = this.informeService.informeActivoId;
    if (!informeId) return;

    this.diezmoSubscription = this.diezmoService.getDiezmos().subscribe((diezmos) => {
      this.diezmos = diezmos.filter((d: DiezmoModel) => d.informe_id === informeId && d.estado !== false);
    });
  }

  guardarDiezmo() {
    if (this.diezmoForm.invalid) {
      Swal.fire('Formulario incompleto', 'Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    const diezmo = this.diezmoForm.value;

    if (this.editando && this.diezmoSeleccionado) {
      this.diezmoService.actualizarDiezmo({ ...diezmo, id: this.diezmoSeleccionado.id }).subscribe(
        () => {
          Swal.fire('Diezmo actualizado', 'El registro se actualizó correctamente', 'success');
          this.cargarDiezmos();
          this.cancelarEdicion();
        },
        (error) => {
          this.mostrarError(error);
        },
      );
    } else {
      this.diezmoService.crearDiezmo(diezmo).subscribe(
        () => {
          Swal.fire('Diezmo registrado', 'Se registró el diezmo correctamente', 'success');
          this.cargarDiezmos();
          this.resetFormulario();
        },
        (error) => {
          this.mostrarError(error);
        },
      );
    }
  }

  editarDiezmo(diezmo: DiezmoModel) {
    this.editando = true;
    this.diezmoSeleccionado = diezmo;
    this.diezmoForm.patchValue({
      sobresRestrictos: diezmo.sobresRestrictos,
      sobresNoRestrictos: diezmo.sobresNoRestrictos,
      restrictos: diezmo.restrictos,
      noRestrictos: diezmo.noRestrictos,
      mes: diezmo.mes,
      informe_id: diezmo.informe_id,
    });
  }

  eliminarDiezmo(diezmo: DiezmoModel) {
    Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.diezmoService.eliminarDiezmo(diezmo.id!).subscribe(
          () => {
            Swal.fire('Eliminado', 'El registro ha sido eliminado', 'success');
            this.cargarDiezmos();
          },
          (error) => {
            this.mostrarError(error);
          },
        );
      }
    });
  }

  cancelarEdicion() {
    this.resetFormulario();
  }

  getNombreMes(mes: number): string {
    return getNombreMes(mes);
  }

  resetFormulario() {
    const informeId = this.informeService.informeActivoId;
    this.diezmoForm.reset({
      sobresRestrictos: '',
      sobresNoRestrictos: '',
      restrictos: '',
      noRestrictos: '',
      mes: '',
      informe_id: informeId,
    });
    this.editando = false;
    this.diezmoSeleccionado = null;
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
      html:
        listaErrores.length > 0
          ? listaErrores.join('')
          : error.error?.msg || 'Ocurrió un error al procesar la solicitud',
    });
  }

  navegarAlInforme() {
    return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }
}
