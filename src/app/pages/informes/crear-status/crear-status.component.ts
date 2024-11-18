import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EstatusModel } from 'src/app/core/models/estatus.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { EstatusService } from 'src/app/services/estatus/estatus.service';
import Swal from 'sweetalert2';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-crear-status',
    templateUrl: './crear-status.component.html',
    styleUrls: ['./crear-status.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgFor,
    ],
})
export class CrearStatusComponent implements OnInit {
  public estatusForm: UntypedFormGroup;

  public estatus: EstatusModel[] = [];
  // Subscription
  public estatusSubscription: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private estatusService: EstatusService
  ) {}

  ngOnInit(): void {
    this.estatusForm = this.formBuilder.group({
      status: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.cargarListaEstatus();
  }

  cargarListaEstatus() {
    this.estatusSubscription = this.estatusService.getEstatus().subscribe((estatus: EstatusModel[]) => {
      this.estatus = estatus.filter((estatu) => estatu.estado === true);
    });
  }

  crearEstatus() {
    const estatusNuevo = this.estatusForm.value;

    this.estatusService.crearEstatus(estatusNuevo).subscribe(
      (estatusCreado: any) => {
        Swal.fire('El estatus fue creado', `${estatusCreado.tipoStatusCreado.status}`, 'success');
        this.resetFormulario();
        this.cargarListaEstatus();
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
    this.estatusForm.reset();
  }
}
