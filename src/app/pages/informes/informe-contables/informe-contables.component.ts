import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-informe-contables',
    templateUrl: './informe-contables.component.html',
    styleUrls: ['./informe-contables.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
})
export class InformeContablesComponent implements OnInit, OnDestroy {
  public contabilidadForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private contabilidadService: ContabilidadService
  ) {}

  ngOnInit(): void {
    this.contabilidadForm = this.formBuilder.group({
      sobres: ['', [Validators.required]],
      transferencia: ['', []],
      restrictos: ['', [Validators.required]],
      noRestrictos: ['', [Validators.required]],
      depositoActividades: ['', []],
      informe_id: ['1', [Validators.required]],
    });
  }

  ngOnDestroy(): void {}

  guardarInformeContable() {
    const informeContabilidad = this.contabilidadForm.value;

    this.contabilidadService.crearContabilidad(informeContabilidad).subscribe(
      (conbailidadCreada: any) => {
        Swal.fire('Informe Contable', 'Se registró el informe contable correctamente', 'success');
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
