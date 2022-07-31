import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DivisaModel } from 'src/app/models/divisa.model';
import { PaisModel } from 'src/app/models/pais.model';
import { Rutas } from 'src/app/routes/menu-items';
import { DivisaService } from 'src/app/services/divisa/divisa.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-pais',
  templateUrl: './crear-pais.component.html',
  styleUrls: ['./crear-pais.component.scss'],
})
export class CrearPaisComponent implements OnInit, OnDestroy {
  public paisForm: FormGroup;

  public paises: PaisModel[] = [];
  public divisas: DivisaModel[] = [];
  public paisSeleccionado: PaisModel;

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
    this.paisSubscription = this.paisService.getPaises().subscribe((pais: PaisModel[]) => {
      this.paises = pais.filter((pais) => pais.estado === true);
    });
  }

  crearPais() {
    const paisNuevo = this.paisForm.value;

    if (this.paisSeleccionado) {
      const data = {
        ...this.paisForm.value,
        id: this.paisSeleccionado.id,
      };

      this.paisService.actualizarPais(data).subscribe((pais: any) => {
        Swal.fire({
          title: 'País Actualizado',
          icon: 'success',
          html: `El país ${pais.paisActualizado.pais} se actualizó correctamente`,
        });
      });
      this.resetFormulario();
      this.cargarPaises();
      this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.PAISES}`);
    } else {
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
          this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.PAISES}`);
        }
      );
    }
  }

  buscarPais(id: string) {
    if (id !== 'nuevo') {
      this.paisService
        .getPais(id)
        .pipe(delay(100))
        .subscribe(
          (paisEncontrado: PaisModel) => {
            const { pais, idDivisa } = paisEncontrado;
            this.paisSeleccionado = paisEncontrado;

            this.paisForm.setValue({ pais, idDivisa });
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Congregacion',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            return this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.PAISES}`);
          }
        );
    }
  }

  resetFormulario() {
    this.paisForm.reset();
  }
}
