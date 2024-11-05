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
      idObreroEncargado: [null, [Validators.required]],
      idObreroEncargadoDos: [null, []],
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
    const campoNuevo = { ...this.campoForm.value };

    // Eliminar los campos que no son números válidos
    ['idObreroEncargado', 'idObreroEncargadoDos'].forEach((campo) => {
      if (campoNuevo[campo] === 'null') {
        delete campoNuevo[campo];
      }
    });

    if (this.campoSeleccionado) {
      const data = {
        ...campoNuevo,
        id: this.campoSeleccionado.id,
      };

      this.campoService.actualizarCampo(data).subscribe(
        (campo: any) => {
          Swal.fire({
            title: 'Campo Actualizado',
            icon: 'success',
            html: `El campo ${campo.campoActualizado.campo} se actualizó correctamente`,
          });
          this.resetFormulario();
          this.cargarCampos();
        },
        (error) => {
          const errores = error.error.errors;
          const listaErrores = Object.values(errores)
            .map((err: any) => `° ${err.msg}<br>`)
            .join('');
          Swal.fire({
            title: 'Error al actualizar campo',
            icon: 'error',
            html: `${listaErrores}`,
          });
        }
      );
    } else {
      this.campoService.crearCampo(campoNuevo).subscribe(
        (campoCreado: any) => {
          Swal.fire({
            title: 'Campo Creado',
            icon: 'success',
            html: `El campo ${campoCreado.campo.campo} se creó correctamente`,
          });
          this.resetFormulario();
          this.cargarCampos();
        },
        (error) => {
          const errores = error.error.errors;
          const listaErrores = Object.values(errores)
            .map((err: any) => `° ${err.msg}<br>`)
            .join('');
          Swal.fire({
            title: 'Error al crear campo',
            icon: 'error',
            html: `${listaErrores}`,
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
          const errores = error.error.errors as { [key: string]: { msg: string } };
          const listaErrores: string[] = [];

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
