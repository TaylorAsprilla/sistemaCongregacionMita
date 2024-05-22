import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import Swal from 'sweetalert2';
import { generate } from 'generate-password-browser';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';
import { AccesoCongregacionMultimedia } from 'src/app/core/interfaces/acceso-multimedia';

@Component({
  selector: 'app-crear-congregacion',
  templateUrl: './crear-congregacion.component.html',
  styleUrls: ['./crear-congregacion.component.scss'],
})
export class CrearCongregacionComponent implements OnInit {
  public congregacionForm: UntypedFormGroup;

  public congregaciones: CongregacionModel[] = [];
  public paises: CongregacionPaisModel[] = [];

  public obreros: UsuarioModel[] = [];

  public congregacionSeleccionada: CongregacionModel;

  // Subscription
  public congregacionSubscription: Subscription;
  public paisSubscription: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private congregacionService: CongregacionService,
    private paisService: PaisService,
    private accesoMultimediaService: AccesoMultimediaService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarCongregacion(id);
    });

    this.activatedRoute.data.subscribe((data: { obrero: UsuarioModel[] }) => {
      this.obreros = data.obrero;
    });

    this.congregacionForm = this.formBuilder.group({
      congregacion: ['', [Validators.required, Validators.minLength(3)]],
      pais_id: ['', [Validators.required]],
      idObreroEncargado: ['', [Validators.required]],
      email: ['', []],
    });

    this.paisSubscription = this.paisService.getPaises().subscribe((pais) => {
      this.paises = pais.filter((pais: CongregacionPaisModel) => pais.estado === true);
    });

    this.cargarCongregaciones();
  }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
    this.congregacionSubscription?.unsubscribe();
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

    if (congregacionNueva.idObreroEncargado === 'null') {
      delete congregacionNueva.idObreroEncargado;
    }

    if (this.congregacionSeleccionada) {
      const data: CongregacionModel = {
        ...this.congregacionForm.value,

        id: this.congregacionSeleccionada.id,
      };

      this.congregacionService.actualizarCongregacion(data).subscribe(
        (congregacion: any) => {
          Swal.fire({
            title: 'Congregación Actualizada',
            icon: 'success',
            html: `La congregación ${congregacion.congregacionActualizada.congregacion} se actualizó correctamente`,
          });
        },
        (error) => {
          console.log(error);
          if (!!error.error.msg) {
            Swal.fire({
              icon: 'info',
              html: error.error.msg,
            });
          }

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
        }
      );

      this.resetFormulario();
      this.cargarCongregaciones();
    } else {
      this.congregacionService.crearCongregacion(congregacionNueva).subscribe(
        (congregacionCreado: any) => {
          Swal.fire({
            title: 'Congregación creada',
            html: `La congregación ${congregacionCreado.congregacion.congregacion} se creó correctamente`,
            icon: 'success',
          });

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
        }
      );
    }
  }

  buscarCongregacion(id: string) {
    if (id !== 'nuevo') {
      this.congregacionService.getCongregacion(Number(id)).subscribe(
        (congregacionEncontrada: CongregacionModel) => {
          const { congregacion, pais_id, idObreroEncargado, email } = congregacionEncontrada;
          this.congregacionSeleccionada = congregacionEncontrada;

          this.congregacionForm.setValue({
            congregacion,
            pais_id,
            idObreroEncargado,
            email,
          });
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

          return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CONGREGACIONES}`);
        }
      );
    }
  }

  crearCredenciales(nombreCongregacion: string, email: string) {
    let congregacion = this.congregaciones.find((congregacion) => congregacion.congregacion === nombreCongregacion);

    if (congregacion) {
      let password = this.generarPassword();
      Swal.fire({
        title: 'CMAR LIVE',
        html: `Desea crear acceso a CMAR LIVE la congregación <b>${congregacion.congregacion}</b>`,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'question',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { value: formValues } = await Swal.fire({
            text: `Credenciales para ${congregacion.congregacion}`,
            html:
              `<p>Credenciales para <b>${congregacion.congregacion}</b></p>` +
              `<label class="input-group obligatorio">Login: </label>
              <input type="text" id="email" name="email" class="form-control"  value="${congregacion.email}"  required />` +
              `<label class="input-group obligatorio">Contraseña: </label>
              <input type="password" id="password" name="password" class="form-control" value="${password}" required />`,

            focusConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCloseButton: true,
            preConfirm: () => {
              return [
                (document.getElementById('email') as HTMLInputElement).value,
                (document.getElementById('password') as HTMLInputElement).value,
              ];
            },
          });

          if (formValues) {
            const data: AccesoCongregacionMultimedia = {
              email: email,
              password: password,
              idCongregacion: congregacion.id,
            };

            this.accesoMultimediaService.crearAccesoCongregacionMultimedia(data).subscribe(
              (accesoCreado: any) => {
                Swal.fire({
                  title: 'Acceso creado',
                  html: `Por favor revise el correo electrónico: <b>${email}</b>`,
                  icon: 'success',
                });
              },
              (error) => {
                let errores = error.error.errors;
                let listaErrores = [];

                if (!!errores) {
                  Object.entries(errores).forEach(([key, value]) => {
                    listaErrores.push('° ' + value['msg'] + '<br>');
                  });
                }

                Swal.fire({
                  title: 'El acceso NO ha sido creado',
                  icon: 'error',
                  html: listaErrores.join('') ? `${listaErrores.join('')}` : error.error.msg,
                });
              }
            );
          }
        } else if (result.isDenied) {
          Swal.fire('No se pudo crear las credeciales de CMAR LIVE', '', 'info');
        }
      });
    }
  }

  generarPassword() {
    const password = generate({
      length: 10,
      numbers: true,
    });

    return password;
  }

  resetFormulario() {
    this.congregacionForm.reset();
  }
}
