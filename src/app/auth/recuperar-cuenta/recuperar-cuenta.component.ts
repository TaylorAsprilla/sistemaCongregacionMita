import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-cuenta',
  templateUrl: './recuperar-cuenta.component.html',
  styleUrls: ['./recuperar-cuenta.component.scss'],
})
export class RecuperarCuentaComponent implements OnInit {
  cuentaForm: FormGroup;

  get Rutas() {
    return RUTAS;
  }

  constructor(private router: Router, private formBuilder: FormBuilder, private usuarioservice: UsuarioService) {}

  ngOnInit(): void {
    this.cuentaForm = this.formBuilder.group({
      login: [localStorage.getItem('login') || '', [Validators.required, Validators.email]],
    });
  }

  recuperarCuenta() {
    const cuentaUsuario = this.cuentaForm.value;
    this.usuarioservice.forgotPassword(cuentaUsuario).subscribe((respuesta: any) => {
      Swal.fire({
        title: 'CMAR LIVE',
        icon: 'warning',
        html: `${respuesta.msg}`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl(`${RUTAS.LOGIN}`);
        }
      });
    });
  }
}
