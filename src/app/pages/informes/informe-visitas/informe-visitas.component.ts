import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VisitaModel } from 'src/app/core/models/visita.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { VisitaService } from 'src/app/services/visita/visita.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-informe-visitas',
    templateUrl: './informe-visitas.component.html',
    styleUrls: ['./informe-visitas.component.scss'],
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule
],
})
export class InformeVisitasComponent implements OnInit, OnDestroy {
  public visitaForm: UntypedFormGroup;

  public visitas: VisitaModel[] = [];

  // Subscription
  public visitaSubscription: Subscription;

  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private visitaService: VisitaService) {}

  ngOnInit(): void {
    this.visitaForm = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      visitasHogares: ['', []],
      cantidad: ['', []],
      efectivo: ['', []],
      referidasOots: ['', []],
      visitaHospital: ['', []],
      observaciones: ['', []],
      informe_id: ['1', [Validators.required]],
    });

    this.visitaSubscription = this.visitaService.getVisita().subscribe((visita: VisitaModel[]) => {
      this.visitas = visita;
    });
  }

  ngOnDestroy(): void {
    this.visitaSubscription?.unsubscribe();
  }

  guardarVisita() {
    const informeVisita = this.visitaForm.value;

    this.visitaService.crearVisita(informeVisita).subscribe(
      (visitaCreada: any) => {
        Swal.fire('Informe de visitas', 'Se registró el informe de visitas correctamente', 'success');
        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores: string[] = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Informe de visitas',
          icon: 'error',
          html: `Error al guardar el informe de visitas <p> ${listaErrores.join('')}`,
        });
      }
    );
  }
}
