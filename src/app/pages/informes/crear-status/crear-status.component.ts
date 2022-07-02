import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EstatusModel } from 'src/app/models/estatus.model';
import { Rutas } from 'src/app/routes/menu-items';
import { EstatusService } from 'src/app/services/estatus/estatus.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-status',
  templateUrl: './crear-status.component.html',
  styleUrls: ['../informes.css'],
})
export class CrearStatusComponent implements OnInit {
  public estatusForm: FormGroup;

  public estatus: EstatusModel[] = [];
  // Subscription
  public estatusSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private router: Router, private estatusService: EstatusService) {}

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
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al creat el tipo de Actividad',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
        this.router.navigateByUrl(Rutas.INICIO);
      }
    );
  }

  resetFormulario() {
    this.estatusForm.reset();
  }
}
