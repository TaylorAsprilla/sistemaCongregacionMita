import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { SituacionVisitaService } from 'src/app/services/situacion-visita/situacion-visita.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-situacion-visita',
  templateUrl: './informe-situacion-visita.component.html',
  styleUrls: ['./informe-situacion-visita.component.scss'],
})
export class InformeSituacionVisitaComponent implements OnInit {
  public situacionVisitaForm: UntypedFormGroup;

  public situacionVisitas: SituacionVisitaModel[] = [];

  // Subscription
  public situacionVisitaSubscription: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private situacionVisitaService: SituacionVisitaService
  ) {}

  ngOnInit(): void {
    this.situacionVisitaForm = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      nombreFeligres: ['', [Validators.required]],
      situacion: ['', []],
      intervencion: ['', []],
      seguimiento: ['', []],
      observaciones: ['', []],
      informe_id: ['1', [Validators.required]],
    });

    this.situacionVisitaSubscription = this.situacionVisitaService
      .getSituacionVisita()
      .subscribe((situacionVisita: SituacionVisitaModel[]) => {
        this.situacionVisitas = situacionVisita;
      });
  }

  guardarSituacionVisita() {
    const situacionVisita = this.situacionVisitaForm.value;

    this.situacionVisitaService.crearSituacionVisita(situacionVisita).subscribe(
      (situacionVisitaCreada: any) => {
        Swal.fire('Situación de las visitas', 'Se registró las situacion de las visitas correctamente', 'success');
        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
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
