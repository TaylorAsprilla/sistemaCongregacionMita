import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONFIGURACION } from 'src/app/core/enums/config.enum';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink],
})
export default class LoginComponent implements OnInit {
  usuariosSubscription: Subscription;
  loginForm: FormGroup;
  qrLoginForm!: FormGroup;
  isLoginFormSubmitted: Boolean;

  submitted = false;
  loading = false;

  ticketQr: string | null = null;
  nombreUsuarioQr: string = '';

  showPassword: boolean = false;

  get Rutas() {
    return RUTAS;
  }

  private route = inject(ActivatedRoute);

  constructor(private router: Router, private formBuilder: FormBuilder, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const ticket = params['ticket'];
      if (ticket) {
        this.ticketQr = ticket;
      }
    });

    this.crearFormularioLogin();
  }

  ngOnDestroy(): void {
    this.usuariosSubscription?.unsubscribe();
  }

  crearFormularioLogin() {
    this.loginForm = this.formBuilder.group({
      login: [localStorage.getItem('login') || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      remember: [localStorage.getItem('login') || false],
    });

    this.qrLoginForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });
  }

  get formLogin() {
    return this.loginForm.controls;
  }

  login() {
    this.isLoginFormSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.usuarioService.login(this.loginForm.value).subscribe(
      (login: any) => {
        const usuario = login.usuario;
        let mensajeBienvenida = '';

        if (login.entidadTipo === CONFIGURACION.USUARIO) {
          const usuario: UsuarioModel = login.usuario;

          const primerNombre: string = usuario.primerNombre ? usuario.primerNombre : login.usuario.nombre;
          const segundoNombre: string = usuario.segundoNombre ? usuario.segundoNombre : '';
          const primerApellido: string = usuario.primerApellido ? usuario.primerApellido : '';
          const segundoApellido: string = usuario.segundoApellido ? usuario.segundoApellido : '';
          mensajeBienvenida = `Bienvenido ${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`;
        } else if (login.entidadTipo === CONFIGURACION.CONGREGACION) {
          mensajeBienvenida = `Bienvenido ${usuario.congregacion}`;
        }

        if (mensajeBienvenida) {
          if (this.loginForm.get('remember')?.value) {
            localStorage.setItem('login', this.loginForm.get('login')?.value);
            localStorage.setItem('remember', this.loginForm.get('remember')?.value);
          } else {
            localStorage.removeItem('login');
          }

          Swal.fire({
            position: 'bottom-end',
            html: mensajeBienvenida,
            showConfirmButton: false,
            timer: 1500,
          });

          // Navegar al Dashboard
          this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
        }
        // Navegar al Dashboard
        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
      },
      (err) => {
        Swal.fire({ icon: 'error', html: `${err.error.msg}` });
      }
    );
  }

  loginConQr() {
    this.submitted = true;

    if (this.qrLoginForm.invalid) {
      this.qrLoginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.nombreUsuarioQr = this.qrLoginForm.value.nombre.trim();

    this.usuarioService.loginPorQr(this.ticketQr!, this.nombreUsuarioQr).subscribe(
      (resp: any) => {
        Swal.fire({
          position: 'bottom-end',
          html: `Bienvenido ${this.nombreUsuarioQr}`,
          showConfirmButton: false,
          timer: 1500,
        });

        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
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
