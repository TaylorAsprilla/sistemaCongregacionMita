import { Component, NgZone, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONFIGURACION } from 'src/app/core/enums/config.enum';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';
import { NumeroMitaResponse, DatosQrLogin } from 'src/app/core/interfaces/usuario.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink],
})
export default class LoginComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private ngZone = inject(NgZone);
  private activatedRoute = inject(ActivatedRoute);

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

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
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
      numeroMita: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      tipoPuesto: ['', [Validators.required]],
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
    this.loading = true;

    // Limpieza y validación robusta
    this.qrLoginForm.patchValue({
      numeroMita: (this.qrLoginForm.value.numeroMita || '').toString().trim(),
      nombre: (this.qrLoginForm.value.nombre || '').trim(),
      tipoPuesto: (this.qrLoginForm.value.tipoPuesto || '').trim(),
    });

    if (this.qrLoginForm.invalid) {
      this.qrLoginForm.markAllAsTouched();
      this.loading = false;
      return;
    }

    const datos: DatosQrLogin = {
      qrCode: this.ticketQr!,
      numeroMita: this.qrLoginForm.value.numeroMita,
      nombre: this.qrLoginForm.value.nombre,
      tipoPuesto: this.qrLoginForm.value.tipoPuesto,
    };

    this.nombreUsuarioQr = datos.nombre;

    this.usuarioService.loginPorQr(datos).subscribe({
      next: (resp: any) => {
        Swal.fire({
          position: 'bottom-end',
          html: `Bienvenido ${this.nombreUsuarioQr}`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.qrLoginForm.reset();
          this.submitted = false;
          this.loading = false;
          this.ngZone.run(() => {
            this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`).catch((err) => {
              console.error('Error en el redireccionamiento:', err);
            });
          });
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({ icon: 'error', html: `${err?.error?.msg || 'Error al iniciar sesión con QR.'}` });
      },
    });
  }

  obtenerAnioActual = (): number => {
    const fechaActual = new Date();
    return fechaActual.getFullYear();
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  usuarioPorNumeroMita() {
    const numeroMita = Number(this.qrLoginForm.get('numeroMita')?.value);

    this.usuarioService.buscarPorNumeroMita(numeroMita).subscribe({
      next: (respuesta: NumeroMitaResponse) => {
        // Solo mostrar los campos que existan y no estén vacíos
        const partes = [
          respuesta.usuario.primerNombre,
          respuesta.usuario.segundoNombre,
          respuesta.usuario.primerApellido,
          respuesta.usuario.segundoApellido,
        ].filter(Boolean);
        const nombre = partes.join(' ');
        this.qrLoginForm.patchValue({
          nombre: nombre,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          html: `No se encuentra el feligres con el número Mita ${numeroMita}`,
        });
      },
    });
  }
}
