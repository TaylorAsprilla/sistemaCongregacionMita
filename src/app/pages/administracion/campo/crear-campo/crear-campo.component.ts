import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { CampoService } from 'src/app/services/campo/campo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-campo',
  templateUrl: './crear-campo.component.html',
  styleUrls: ['./crear-campo.component.scss'],
})
export class CrearCampoComponent implements OnInit {
  public campoForm: UntypedFormGroup;

  public campos: CampoModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public obreros: UsuarioModel[] = [];

  // Subscription
  public campoSubscription: Subscription;
  public congregacionSubscription: Subscription;
  public usuariosSubscription: Subscription;

  public campoSeleccionado: CampoModel;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private campoService: CampoService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarCampo(id);
    });

    this.activatedRoute.data.subscribe((data: { obrero: UsuarioModel[]; congregacion: CongregacionModel[] }) => {
      this.congregaciones = data.congregacion;
      this.obreros = data.obrero;
    });

    this.campoForm = this.formBuilder.group({
      campo: ['', [Validators.required, Validators.minLength(3)]],
      congregacion_id: ['', [Validators.required]],
      idObreroEncargado: ['', [Validators.required]],
      idObreroEncargadoDos: ['', []],
    });

    this.cargarCampos();
  }

  ngOnDestroy(): void {
    this.campoSubscription?.unsubscribe();
  }

  cargarCampos() {
    this.campoSubscription = this.campoService.getCampos().subscribe((campo: CampoModel[]) => {
      this.campos = campo.filter((campo) => campo.estado === true);
    });
  }

  crearCampo() {
    const campoNuevo = this.campoForm.value;

    if (campoNuevo.idObreroEncargado === 'null') {
      delete campoNuevo.idObreroEncargado;
    }

    if (this.campoSeleccionado) {
      const data = {
        ...this.campoForm.value,
        id: this.campoSeleccionado.id,
      };

      this.campoService.actualizarCampo(data).subscribe((campo: any) => {
        Swal.fire({
          title: 'Campo Actualizado',
          icon: 'success',
          html: `El campo ${campo.campoActualizado.campo} se actualizó correctamente`,
        });
      });
      this.resetFormulario();
      this.cargarCampos();
    } else {
      this.campoService.crearCampo(campoNuevo).subscribe(
        (campoCreado: any) => {
          Swal.fire('Campo creado', `${campoCreado.campo.campo}`, 'success');
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
          this.router.navigateByUrl(RUTAS.INICIO);
        }
      );
    }
  }

  buscarCampo(id: string) {
    if (id !== 'nuevo') {
      this.campoService.getCampo(Number(id)).subscribe(
        (campoActualizado: CampoModel) => {
          const { campo, congregacion_id, idObreroEncargado, idObreroEncargadoDos } = campoActualizado;
          this.campoSeleccionado = campoActualizado;

          this.campoForm.setValue({ campo, congregacion_id, idObreroEncargado, idObreroEncargadoDos });
        },
        (error) => {
          let errores = error.error.errors;
          let listaErrores = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Campo',
            icon: 'error',
            html: `${listaErrores.join('')}`,
          });

          return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CAMPOS}`);
        }
      );
    }
  }

  resetFormulario() {
    this.campoForm.reset();
  }
}
