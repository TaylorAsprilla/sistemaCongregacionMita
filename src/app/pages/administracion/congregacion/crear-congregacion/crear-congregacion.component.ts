import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ListarUsuario } from 'src/app/core/interfaces/usuario.interface';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { Rutas } from 'src/app/routes/menu-items';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-congregacion',
  templateUrl: './crear-congregacion.component.html',
  styleUrls: ['./crear-congregacion.component.scss'],
})
export class CrearCongregacionComponent implements OnInit {
  public congregacionForm: FormGroup;

  public congregaciones: CongregacionModel[] = [];
  public paises: PaisModel[] = [];
  public usuarios: UsuarioModel[] = [];

  public congregacionSeleccionada: CongregacionModel;

  // Subscription
  public congregacionSubscription: Subscription;
  public paisSubscription: Subscription;
  public usuariosSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activateRouter: ActivatedRoute,
    private congregacionService: CongregacionService,
    private paisService: PaisService,
    private usuariosService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.activateRouter.params.subscribe(({ id }) => {
      this.buscarCongregacion(id);
    });

    this.congregacionForm = this.formBuilder.group({
      congregacion: ['', [Validators.required, Validators.minLength(3)]],
      pais_id: ['', [Validators.required]],
      idObreroEncargado: ['', [Validators.required]],
    });

    this.paisSubscription = this.paisService.getPaises().subscribe((pais) => {
      this.paises = pais.filter((pais: PaisModel) => pais.estado === true);
    });

    this.usuariosSubscription = this.usuariosService.listarTodosLosUsuarios().subscribe((usuarios: ListarUsuario) => {
      this.usuarios = usuarios.usuarios;
    });

    this.cargarCongregaciones();
  }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
    this.congregacionSubscription?.unsubscribe();
    this.usuariosSubscription?.unsubscribe();
  }

  cargarCongregaciones() {
    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .subscribe((congregacion: CongregacionModel[]) => {
        this.congregaciones = congregacion.filter((congregacion) => congregacion.estado === true);
      });
  }

  crearCongregacion() {
    const congregacionNueva = this.congregacionForm.value;

    if (this.congregacionSeleccionada) {
      const data = {
        ...this.congregacionForm.value,
        id: this.congregacionSeleccionada.id,
      };

      this.congregacionService.actualizarCongregacion(data).subscribe((congregacion: any) => {
        Swal.fire({
          title: 'Congregación Actualizada',
          icon: 'success',
          html: `La congregación ${congregacion.congregacionActualizada.congregacion} se actualizó correctamente`,
        });
      });

      this.resetFormulario();
      this.cargarCongregaciones();
      this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CONGREGACIONES}`);
    } else {
      this.congregacionService.crearCongregacion(congregacionNueva).subscribe(
        (congregacionCreado: any) => {
          Swal.fire({
            title: 'Congregación creada',
            html: `La congregación ${congregacionCreado.congregacion.congregacion} de creó correctamente`,
            icon: 'success',
          });

          this.resetFormulario();
          this.cargarCongregaciones();
          this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CONGREGACIONES}`);
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
          this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CONGREGACIONES}`);
        }
      );
    }
  }

  buscarCongregacion(id: string) {
    if (id !== 'nuevo') {
      this.congregacionService
        .getCongregacion(Number(id))
        .pipe(delay(100))
        .subscribe(
          (congregacionEncontrada: CongregacionModel) => {
            const { congregacion, pais_id } = congregacionEncontrada;
            this.congregacionSeleccionada = congregacionEncontrada;

            this.congregacionForm.setValue({ congregacion, pais_id });
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

            return this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CONGREGACIONES}`);
          }
        );
    }
  }

  resetFormulario() {
    this.congregacionForm.reset();
  }
}
