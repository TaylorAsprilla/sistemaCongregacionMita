import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampoModel } from 'src/app/models/campo.model';
import { CongregacionModel } from 'src/app/models/congregacion.model';
import { Rutas } from 'src/app/routes/menu-items';
import { CampoService } from 'src/app/services/campo/campo.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-campo',
  templateUrl: './crear-campo.component.html',
  styleUrls: ['./crear-campo.component.css'],
})
export class CrearCampoComponent implements OnInit {
  public campoForm: FormGroup;

  public campos: CampoModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  // Subscription
  public campoSubscription: Subscription;
  public congregacionSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private campoService: CampoService,
    private congregacionService: CongregacionService
  ) {}

  ngOnInit(): void {
    this.campoForm = this.formBuilder.group({
      campo: ['', [Validators.required, Validators.minLength(3)]],
      congregacion_id: ['', [Validators.required]],
      //  constructor(public id: number, public campo: string, public estado: boolean, public congregacion_id: number) {}
    });

    this.congregacionSubscription = this.congregacionService.listarCongregacion().subscribe((congregacion) => {
      this.congregaciones = congregacion.filter((congregacion: CongregacionModel) => congregacion.estado === true);
    });

    this.cargarCampos();
  }

  cargarCampos() {
    this.campoSubscription = this.campoService.listarCampo().subscribe((campo: CampoModel[]) => {
      this.campos = campo.filter((campo) => campo.estado === true);
    });
  }

  crearCampo() {
    const campoNuevo = this.campoForm.value;

    console.log(campoNuevo);

    this.campoService.crearCampo(campoNuevo).subscribe(
      (campoCreado: any) => {
        // Swal.fire('Tipo de actividad creada', `${actividadCreada.tipoActividadCreado.nombre}`, 'success');
        Swal.fire('Campo creado', `${campoCreado.campo}`, 'success');
        this.resetFormulario();
        this.cargarCampos();
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al crear campo',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
        this.router.navigateByUrl(Rutas.INICIO);
      }
    );
  }

  resetFormulario() {
    this.campoForm.reset();
  }
}
