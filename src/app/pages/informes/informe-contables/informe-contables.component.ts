import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/routes/menu-items';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-contables',
  templateUrl: './informe-contables.component.html',
  styleUrls: ['./informe-contables.component.scss'],
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
      transferencia: ['', [Validators.required]],
      restrictos: ['', [Validators.required]],
      noRestrictos: ['', [Validators.required]],
      depositoActividades: ['', [Validators.required]],
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
        this.navegarAlInforme();
      }
    );
  }

  navegarAlInforme() {
    return this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.INFORME}`);
  }
}
