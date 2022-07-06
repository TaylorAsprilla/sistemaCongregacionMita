import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AsuntoPendienteModel } from 'src/app/models/asunto-pendiente.model';
import { Rutas } from 'src/app/routes/menu-items';
import { AsuntoPendienteService } from 'src/app/services/asunto-pendiente/asunto-pendiente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-asunto-pendiente',
  templateUrl: './informe-asunto-pendiente.component.html',
  styleUrls: ['./informe-asunto-pendiente.component.scss'],
})
export class InformeAsuntoPendienteComponent implements OnInit, OnDestroy {
  public asuntoPendienteForm: FormGroup;

  asuntosPendientes: AsuntoPendienteModel[] = [];

  // Subscription
  public asuntoPendienteSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private asuntoPendienteService: AsuntoPendienteService
  ) {}

  ngOnInit(): void {
    this.asuntoPendienteForm = this.formBuilder.group({
      asunto: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      observaciones: ['', []],
      estado: ['', []],
      informe_id: ['1', [Validators.required]],
    });

    this.asuntoPendienteSubscription = this.asuntoPendienteService
      .getAsuntoPendiente()
      .subscribe((asuntoPendiente: AsuntoPendienteModel[]) => {
        this.asuntosPendientes = asuntoPendiente;
      });
  }

  ngOnDestroy(): void {
    this.asuntoPendienteSubscription?.unsubscribe();
  }

  guardarInformeAsuntoPendiete() {
    const asuntoPendiente = this.asuntoPendienteForm.value;

    this.asuntoPendienteService.crearasuntoPendiente(asuntoPendiente).subscribe(
      (asuntoPendienteCreado: any) => {
        Swal.fire('Asunto pendiente', 'Se registró el asunto pendiente correctamente', 'success');
        this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.INFORME}`);
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Situación de las visitas',
          icon: 'error',
          html: `Error al guardar la situación de la visita <p> ${listaErrores.join('')}`,
        });
      }
    );
  }
}
