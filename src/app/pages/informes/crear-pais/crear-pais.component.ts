import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DivisaModel } from 'src/app/models/divisa.model';
import { PaisModel } from 'src/app/models/pais.model';
import { Rutas } from 'src/app/routes/menu-items';
import { DivisaService } from 'src/app/services/divisa/divisa.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-pais',
  templateUrl: './crear-pais.component.html',
  styleUrls: ['./crear-pais.component.css'],
})
export class CrearPaisComponent implements OnInit, OnDestroy {
  public paisForm: FormGroup;

  public paises: PaisModel[] = [];
  public divisas: DivisaModel[] = [];
  // Subscription
  public paisSubscription: Subscription;
  public divisaSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private paisService: PaisService,
    private divisaService: DivisaService
  ) {}

  ngOnInit(): void {
    this.paisForm = this.formBuilder.group({
      pais: ['', [Validators.required, Validators.minLength(3)]],
      idDivisa: ['', [Validators.required]],
    });

    this.divisaSubscription = this.divisaService.listarDivisa().subscribe((divisa) => {
      this.divisas = divisa;
    });

    this.cargarPaises();
  }

  ngOnDestroy(): void {
    this.divisaSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
  }

  cargarPaises() {
    this.paisSubscription = this.paisService.listarPais().subscribe((pais: PaisModel[]) => {
      this.paises = pais.filter((pais) => pais.estado === true);
    });
  }

  crearPais() {
    const paisNuevo = this.paisForm.value;

    this.paisService.crearPais(paisNuevo).subscribe(
      (paisCreado: any) => {
        Swal.fire('Pais creado', `${paisCreado.pais.pais}`, 'success');
        this.resetFormulario();
        this.cargarPaises();
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al crear pais',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
        this.router.navigateByUrl(Rutas.INICIO);
      }
    );
  }

  resetFormulario() {
    this.paisForm.reset();
  }
}
