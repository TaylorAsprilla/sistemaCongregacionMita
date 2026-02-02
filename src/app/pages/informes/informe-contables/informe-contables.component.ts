import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-contables',
  templateUrl: './informe-contables.component.html',
  styleUrls: ['./informe-contables.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class InformeContablesComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private contabilidadService = inject(ContabilidadService);
  private informeService = inject(InformeService);

  public contabilidadForm: UntypedFormGroup;

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

    this.contabilidadForm = this.formBuilder.group({
      sobres: ['', [Validators.required]],
      restrictos: ['', [Validators.required]],
      noRestrictos: ['', [Validators.required]],
      informe_id: [informeId, [Validators.required]],
    });
  }

  guardarInformeContable() {
    const informeContabilidad = this.contabilidadForm.value;

    this.contabilidadService.crearContabilidad(informeContabilidad).subscribe(
      (conbailidadCreada: any) => {
        Swal.fire('Informe Contable', 'Se registró el informe contable correctamente', 'success');
        this.contabilidadForm.reset();
        const informeId = this.informeService.informeActivoId;
        this.contabilidadForm.patchValue({ informe_id: informeId });
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
