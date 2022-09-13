import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ListarUsuario } from 'src/app/interfaces/usuario.interface';
import { CampoModel } from 'src/app/models/campo.model';
import { CongregacionModel } from 'src/app/models/congregacion.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Rutas } from 'src/app/routes/menu-items';
import { CampoService } from 'src/app/services/campo/campo.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-campo',
  templateUrl: './crear-campo.component.html',
  styleUrls: ['./crear-campo.component.scss'],
})
export class CrearCampoComponent implements OnInit {
  public campoForm: FormGroup;

  public campos: CampoModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public usuarios: UsuarioModel[] = [];

  // Subscription
  public campoSubscription: Subscription;
  public congregacionSubscription: Subscription;
  public usuariosSubscription: Subscription;

  public campoSeleccionado: CampoModel;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private campoService: CampoService,
    private congregacionService: CongregacionService,
    private activateRouter: ActivatedRoute,
    private usuariosService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.activateRouter.params.subscribe(({ id }) => {
      this.buscarCampo(id);
    });

    this.campoForm = this.formBuilder.group({
      campo: ['', [Validators.required, Validators.minLength(3)]],
      congregacion_id: ['', [Validators.required]],
    });

    this.congregacionSubscription = this.congregacionService.getCongregaciones().subscribe((congregacion) => {
      this.congregaciones = congregacion.filter((congregacion: CongregacionModel) => congregacion.estado === true);
    });

    this.usuariosSubscription = this.usuariosService.listarTodosLosUsuarios().subscribe((usuarios: ListarUsuario) => {
      this.usuarios = usuarios.usuarios;
    });

    this.cargarCampos();
  }

  ngOnDestroy(): void {
    this.campoSubscription?.unsubscribe();
    this.congregacionSubscription?.unsubscribe();
    this.usuariosSubscription?.unsubscribe();
  }

  cargarCampos() {
    this.campoSubscription = this.campoService.listarCampo().subscribe((campo: CampoModel[]) => {
      this.campos = campo.filter((campo) => campo.estado === true);
    });
  }

  crearCampo() {
    const campoNuevo = this.campoForm.value;

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
        this.router.navigateByUrl(Rutas.INICIO);
      }
    );
  }

  buscarCampo(id: string) {
    if (id !== 'nuevo') {
      this.campoService
        .getCampo(Number(id))
        .pipe(delay(100))
        .subscribe(
          (campoActualizado: CampoModel) => {
            const { campo, congregacion_id } = campoActualizado;
            this.campoSeleccionado = campoActualizado;

            this.campoForm.setValue({ campo, congregacion_id });
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

            return this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CAMPOS}`);
          }
        );
    }
  }

  resetFormulario() {
    this.campoForm.reset();
  }
}
