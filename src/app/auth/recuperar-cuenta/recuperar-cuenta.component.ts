import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-cuenta',
  templateUrl: './recuperar-cuenta.component.html',
  styleUrls: ['./recuperar-cuenta.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
})
export default class RecuperarCuentaComponent implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private usuarioservice = inject(UsuarioService);

  cuentaForm: FormGroup;

  get Rutas() {
    return RUTAS;
  }

  ngOnInit(): void {
    this.cuentaForm = this.formBuilder.group({
      login: [localStorage.getItem('login') || '', [Validators.required, Validators.email]],
    });
  }

  recuperarCuenta() {
    const cuentaUsuario = this.cuentaForm.value;
    this.usuarioservice.forgotPassword(cuentaUsuario).subscribe(
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

      (error) => {
        let errores = error.error.msg;

        Swal.fire({
          icon: 'info',
          html: `${errores}`,
        });
      }
    );
  }

  obtenerAnioActual = (): number => {
    const fechaActual = new Date();
    return fechaActual.getFullYear();
  };
}
