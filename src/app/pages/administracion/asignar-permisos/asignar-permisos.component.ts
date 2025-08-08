import Swal from 'sweetalert2';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy, inject } from '@angular/core';
import {
  AbstractControlOptions,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PermisoService } from 'src/app/services/permiso/permiso.service';
import { PermisoModel } from 'src/app/core/models/permisos.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { generate } from 'generate-password-browser';
import { BuscarUsuarioComponent } from '../../../components/buscar-usuario/buscar-usuario.component';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-asignar-permisos',
  templateUrl: './asignar-permisos.component.html',
  styleUrls: ['./asignar-permisos.component.scss'],
  standalone: true,
  imports: [BuscarUsuarioComponent, FormsModule, ReactiveFormsModule, NgxIntlTelInputModule],
})
export default class AsignarPermisosComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private permisosService = inject(PermisoService);
  private router = inject(Router);

  permisosForm: FormGroup;
  passwordUsuarioForm: FormGroup;

  permisos: PermisoModel[] = [];
  permisosUsuario: number[];

  usuarioEncontrado: UsuarioModel;

  formSubmitted: boolean = false;
  asignarPermisos: boolean = false;

  permisoSubscription: Subscription;

  @ViewChild('verPermisos') verPermisos: ElementRef;

  ngOnInit(): void {
    this.permisoSubscription = this.permisosService.getPermisos().subscribe((permiso: PermisoModel[]) => {
      this.permisos = permiso;
    });

    this.crearFormularioPermisos();
    this.crearFormularioPassword();
  }

  ngOnDestroy(): void {
    this.permisoSubscription?.unsubscribe();
  }

  get permisosArr() {
    return this.permisosForm?.get('permisos') as FormArray;
  }

  crearFormularioPermisos() {
    const controlPermisos = this.permisos.map((control) => this.formBuilder.control(false));
    this.permisosForm = this.formBuilder.group({
      permisos: this.formBuilder.array(controlPermisos),
    });
  }

  crearFormularioPassword() {
    this.passwordUsuarioForm = this.formBuilder.group(
      {
        passwordNuevoUno: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*[A-Z])/)]],
        passwordNuevoDos: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*[A-Z])/)]],
      },
      {
        validators: this.passwordsIguales('passwordNuevoUno', 'passwordNuevoDos'),
      } as AbstractControlOptions
    );
  }

  passwordsIguales(passwordNuevoUno: string, passwordNuevoDos: string) {
    return (formGroup: FormGroup) => {
      const passwordNuevoUnoControl = formGroup.controls[passwordNuevoUno];
      const passwordNuevoDosControl = formGroup.controls[passwordNuevoDos];

      if (passwordNuevoUnoControl.value === passwordNuevoDosControl.value) {
        passwordNuevoDosControl.setErrors(null);
      } else {
        passwordNuevoDosControl.setErrors({ noEsIgual: true });
      }
    };
  }

  passwordNoValidos() {
    const passwordNuevoUno = this.passwordUsuarioForm.controls['passwordNuevoUno'];
    const passwordNuevoDos = this.passwordUsuarioForm.controls['passwordNuevoDos'];

    if (passwordNuevoUno !== passwordNuevoDos && this.formSubmitted && !this.passwordUsuarioForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  resetPassword(): void {
    this.formSubmitted = true;
    const { passwordNuevoUno, passwordNuevoDos } = this.passwordUsuarioForm.value;

    if (passwordNuevoUno !== passwordNuevoDos) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        html: 'Las contraseñas no coinciden. Por favor, verifique e intente nuevamente.',
      });
      return;
    }

    if (this.usuarioEncontrado.login) {
      // Enviar solicitud para restablecer la contraseña
      this.usuarioService.resetPassword(this.usuarioEncontrado.login, passwordNuevoUno).subscribe(
        () => {
          Swal.fire('Actualizado', 'Se creó una nueva contraseña', 'success');

          // Reiniciar el formulario y el estado después de un cambio exitoso
          this.passwordUsuarioForm.reset();
          this.formSubmitted = false;
        },
        (error) => {
          const listaErrores: string[] = [];
          const errores = error?.error?.errors as { [key: string]: { msg: string } } | undefined;

          // Manejar y mostrar errores específicos si existen
          if (errores) {
            Object.entries(errores).forEach(([_, value]) => {
              listaErrores.push('° ' + value.msg + '<br>');
            });
          }

          Swal.fire({
            title: 'Error',
            icon: 'error',
            html: listaErrores.length
              ? `Error al crear una nueva contraseña:<br> ${listaErrores.join('')}`
              : 'Ocurrió un error al intentar crear la nueva contraseña.',
          });
        }
      );
    }
  }

  buscarFeligres(usuario: UsuarioModel) {
    this.asignarPermisos = false;
    this.usuarioEncontrado = usuario;

    if (this.usuarioEncontrado) {
      this.crearFormularioPermisos();
      this.patchValuePermisos();
    }
  }

  arrayUsuarioData() {
    const data = this.usuarioEncontrado?.usuarioPermiso;
    return Array.isArray(data) ? data.map((item: any) => item?.id).filter(Boolean) : [];
  }

  patchValuePermisos() {
    this.permisosUsuario = this.arrayUsuarioData();

    this.permisos.map((permiso: PermisoModel, i: number) => {
      if (this.permisosUsuario?.indexOf(permiso.id) !== -1) {
        this.permisosArr.at(i)?.patchValue(true);
      }
    });
  }

  gestionarPermiso(index: number, event: any) {
    const selectedPermisos = this.permisosForm.get('permisos') as FormArray;

    if (event.target.checked) {
      selectedPermisos.push(this.formBuilder.control(this.permisos[index].id));
    } else {
      const index = selectedPermisos.controls.findIndex((x) => x.value === event.target.value);
      selectedPermisos.removeAt(index);
    }
  }

  permisosSelecionados(): number[] {
    const permisosSeleccionados = this.permisosForm.value.permisos
      .map((checked: any, i: number) => (checked ? this.permisos[i].id : null))
      .filter((value: any) => value !== null);
    return permisosSeleccionados;
  }

  agregarPermisos() {
    const permisosSeleccionados = this.permisosSelecionados();

    if (permisosSeleccionados.length === 0) {
      Swal.fire('Error', 'Debes seleccionar al menos un permiso', 'error');
      return;
    }

    this.usuarioService.actualizarPermisos(this.usuarioEncontrado.id, permisosSeleccionados).subscribe(
      (usuarioActualizado) => {
        Swal.fire('Actualizado', 'Los permisos del usuario se agregaron satisfactoriamente', 'success');
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores: string[] = [];

        Object.entries(errores).forEach(([key, value]) => {
          if (value && typeof value === 'object' && 'msg' in value) {
            listaErrores.push(`° ${value['msg']}<br>`);
          }
        });

        Swal.fire({
          title: 'Error',
          icon: 'error',
          html: `Error al actualizar el perfil <p> ${listaErrores.join('')}`,
        });
      }
    );
  }

  actualizarUsuario(usuario: UsuarioModel) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${usuario.id}`);
  }

  crearAcceso(usuario: UsuarioModel) {
    const nombre = `${usuario.primerNombre} ${usuario.segundoNombre} ${usuario.primerApellido} ${usuario.segundoApellido}`;
    let password = this.generarPassword();
    Swal.fire({
      title: 'CMAR LIVE',
      html: `Desea crear acceso a CMAR LIVE al usuario <b>${nombre}</b>`,
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
          text: `Credenciales para ${nombre}`,
          html:
            `<p>Credenciales para <b>${nombre}</b></p>` +
            `<label class="input-group obligatorio">Login: </label>
              <input type="text" id="login" name="login" class="form-control"  value="${usuario.email}"  required />` +
            `<label class="input-group obligatorio">Contraseña: </label>
              <input type="password" id="password" name="password" class="form-control" value="${password}" required />`,

          focusConfirm: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCloseButton: true,
          preConfirm: () => {
            return [
              (document.getElementById('login') as HTMLInputElement).value,
              (document.getElementById('password') as HTMLInputElement).value,
            ];
          },
        });

        if (formValues) {
          const login = (document.getElementById('login') as HTMLInputElement).value;

          this.usuarioService.crearAcceso(usuario.id, login, password).subscribe(
            (accesoCreado: any) => {
              this.asignarPermisos = accesoCreado.ok;
              Swal.fire({
                title: 'Acceso creado',
                text: 'Por favor asignele al feligrez los permisos correspondientes',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.scrollToSection();
                }
              });
            },
            (error) => {
              let errores = error.error.errors;
              let listaErrores: string[] = [];

              if (!!errores) {
                Object.entries(errores).forEach(([key, value]) => {
                  if (value && typeof value === 'object' && 'msg' in value) {
                    listaErrores.push(`° ${value['msg']}<br>`);
                  }
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

  generarPassword() {
    const password = generate({
      length: 10,
      numbers: true,
    });

    return password;
  }

  scrollToSection() {
    setTimeout(() => {
      const permissionsElement = this.verPermisos?.nativeElement;

      if (permissionsElement && permissionsElement.scrollIntoView) {
        permissionsElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 200);
  }
}
