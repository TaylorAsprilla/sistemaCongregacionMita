import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-password-usuario',
  templateUrl: './cambiar-password-usuario.component.html',
  styleUrls: ['./cambiar-password-usuario.component.scss'],
})
export class CambiarPasswordUsuarioComponent implements OnInit {
  passwordUsuarioForm: FormGroup;
  formSubmitted: boolean = false;
  idusuario: number;

  get Rutas() {
    return RUTAS;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private usuarioservice: UsuarioService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idusuario = this.usuarioservice.usuarioId;

    this.passwordUsuarioForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(5)]],
        passwordNuevoUno: ['', [Validators.required, Validators.minLength(5)]],
        passwordNuevoDos: ['', [Validators.required, Validators.minLength(5)]],
      },
      {
        validators: this.passwordsIguales('passwordNuevoUno', 'passwordNuevoDos'),
      } as AbstractControlOptions
    );
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

  cambiarPassword() {
    this.formSubmitted = true;
    const passwordAntiguo = this.passwordUsuarioForm.controls['password']?.value;
    const passwordNuevoUno = this.passwordUsuarioForm.controls['passwordNuevoUno']?.value;

    if (this.passwordUsuarioForm.valid) {
      this.usuarioservice.cambiarPasswordUsuario(this.idusuario, passwordAntiguo, passwordNuevoUno).subscribe(
        (respuesta: any) => {
          Swal.fire({
            title: 'CMAR LIVE',
            icon: 'warning',
            html: `${respuesta.msg}`,
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl(`${RUTAS.LOGIN}`);
            }
          });
        },
        (err) => {
          Swal.fire({
            title: 'CMAR LIVE',
            icon: 'warning',
            html: `${err.error.msg}`,
          });
        }
      );
    }
  }

  irAlInicio() {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
  }
}
