import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
})
export default class CambiarPasswordComponent implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private usuarioservice = inject(UsuarioService);
  private activatedRouter = inject(ActivatedRoute);

  passwordForm: FormGroup;
  formSubmitted: boolean = false;
  token: string = '';

  get Rutas() {
    return RUTAS;
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(({ token }) => {
      this.token = token;
    });

    this.passwordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(5)]],
        passwordDos: ['', [Validators.required, Validators.minLength(5)]],
      },
      {
        validators: this.passwordsIguales('password', 'passwordDos'),
      } as AbstractControlOptions
    );
  }

  passwordNoValidos() {
    const passwordUno = this.passwordForm.controls['password'];
    const passwordDos = this.passwordForm.controls['passwordDos'];

    if (passwordUno !== passwordDos && this.formSubmitted && !this.passwordForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(password: string, passwordDos: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const passwordDosControl = formGroup.controls[passwordDos];

      if (passwordControl.value === passwordDosControl.value) {
        passwordDosControl.setErrors(null);
      } else {
        passwordDosControl.setErrors({ noEsIgual: true });
      }
    };
  }

  cambiarPassword() {
    this.formSubmitted = true;
    const passwordUno = this.passwordForm.controls['password'];

    if (this.passwordForm.valid) {
      this.usuarioservice.cambiarPassword(passwordUno.value, this.token).subscribe(
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
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl(`${RUTAS.LOGIN}`);
            }
          });
        }
      );
    }
  }

  obtenerAnioActual = (): number => {
    const fechaActual = new Date();
    return fechaActual.getFullYear();
  };
}
