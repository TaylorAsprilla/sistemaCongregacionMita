import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CongregacionModel } from 'src/app/models/congregacion.model';
import { PaisModel } from 'src/app/models/pais.model';
import { Rutas } from 'src/app/routes/menu-items';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-congregacion',
  templateUrl: './crear-congregacion.component.html',
  styleUrls: ['./crear-congregacion.component.css'],
})
export class CrearCongregacionComponent implements OnInit {
  // constructor(public id: number, public congregacion: string, public estado: boolean, public pais_id: number) {}

  public congregacionForm: FormGroup;

  public congregaciones: CongregacionModel[] = [];
  public paises: PaisModel[] = [];
  // Subscription
  public congregacionSubscription: Subscription;
  public paisSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private congregacionService: CongregacionService,
    private paisService: PaisService
  ) {}

  ngOnInit(): void {
    this.congregacionForm = this.formBuilder.group({
      congregacion: ['', [Validators.required, Validators.minLength(3)]],
      pais_id: ['', [Validators.required]],
    });

    this.paisSubscription = this.paisService.listarPais().subscribe((pais) => {
      this.paises = pais.filter((pais: PaisModel) => pais.estado === true);
    });

    this.cargarCongregaciones();
  }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
    this.congregacionSubscription?.unsubscribe();
  }

  cargarCongregaciones() {
    this.congregacionSubscription = this.congregacionService
      .listarCongregacion()
      .subscribe((congregacion: CongregacionModel[]) => {
        this.congregaciones = congregacion.filter((congregacion) => congregacion.estado === true);
      });
  }

  crearCongregacion() {
    const congregacionNueva = this.congregacionForm.value;

    this.congregacionService.crearCongregacion(congregacionNueva).subscribe(
      (congregacionCreado: any) => {
        Swal.fire('Congregación creada', `${congregacionCreado.congregacion.congregacion}`, 'success');
        this.resetFormulario();
        this.cargarCongregaciones();
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al crear congregacion',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
        this.router.navigateByUrl(Rutas.INICIO);
      }
    );
  }

  resetFormulario() {
    this.congregacionForm.reset();
  }
}
