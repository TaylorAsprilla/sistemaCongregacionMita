import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  usuariosSubscription: Subscription;
  loginForm: FormGroup;

  showPassword: boolean = false;

  get Rutas() {
    return RUTAS;
  }

  constructor(private router: Router, private formBuilder: FormBuilder, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuariosSubscription = this.usuarioService.listarUsuarios().subscribe(
      (res) => console.log(res),
      (err) => console.error(err)
    );

    this.crearFormularioLogin();
  }

  ngOnDestroy(): void {
    this.usuariosSubscription?.unsubscribe();
  }

  crearFormularioLogin() {
    this.loginForm = this.formBuilder.group({
      login: [localStorage.getItem('login') || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      remember: [false],
    });
  }

  login() {
    this.usuarioService.login(this.loginForm.value).subscribe(
      (loginUsuario: any) => {
        const usuario: UsuarioModel = loginUsuario.usuario;

        if (!!usuario) {
          const primerNombre: string = usuario.primerNombre ? usuario.primerNombre : loginUsuario.usuario.nombre;
          const segundoNombre: string = usuario.segundoNombre ? usuario.segundoNombre : '';
          const primerApellido: string = usuario.primerApellido ? usuario.primerApellido : '';
          const segundoApellido: string = usuario.segundoApellido ? usuario.segundoApellido : '';

          if (this.loginForm.get('remember').value) {
            localStorage.setItem('login', this.loginForm.get('login').value);
          } else {
            localStorage.removeItem('login');
          }
          Swal.fire({
            position: 'bottom-end',
            html: `Bienvenido ${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`,
            showConfirmButton: false,
            timer: 1500,
          });

          // Navegar al Dashboard
          this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
        }
      },
      (err) => {
        Swal.fire({ icon: 'error', html: `${err.error.msg}` });
      }
    );
  }

  obtenerAnioActual = (): number => {
    const fechaActual = new Date();
    return fechaActual.getFullYear();
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
