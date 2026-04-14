import { Component, NgZone, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONFIGURACION } from 'src/app/core/enums/config.enum';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UserSessionService } from 'src/app/services/user-session/user-session.service';
import { SessionMonitorService } from 'src/app/core/services/session-monitor.service';
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
  private userSessionService = inject(UserSessionService);
  private sessionMonitorService = inject(SessionMonitorService);
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

    // PASO 1: Verificar si hay sesiones activas antes de hacer login
    this.sessionMonitorService.checkActiveSessionsBeforeLogin(this.loginForm.value).subscribe({
      next: (response: any) => {
        if (response.ok && response.hasActiveSessions) {
          // Hay sesiones activas, mostrar modal de confirmación
          this.mostrarModalCerrarSesionesActivas(response.activeSessions, response.newLocation);
        } else {
          // No hay sesiones activas, proceder con login normal
          this.procederConLogin();
        }
      },
      error: (err) => {
        // Si falla la verificación, proceder con login normal
        console.warn('⚠️ No se pudo verificar sesiones activas, procediendo con login', err);
        this.procederConLogin();
      },
    });
  }

  /**
   * Muestra modal de confirmación para cerrar sesiones activas
   */
  private mostrarModalCerrarSesionesActivas(sesiones: any[], nuevaUbicacion: any): void {
    const sesionesHTML = sesiones
      .map((sesion: any) => {
        const dispositivo = sesion.device?.tipoDispositivo || 'desconocido';
        const ubicacion = `${sesion.sessionLocation?.ciudad || 'Desconocida'}, ${sesion.sessionLocation?.pais || 'Desconocido'}`;
        const icono = dispositivo === 'mobile' ? '📱' : dispositivo === 'tablet' ? '📲' : '💻';
        return `
          <div style="text-align: left; padding: 8px; margin: 4px 0; background: #f8f9fa; border-left: 3px solid #667eea; border-radius: 4px;">
            ${icono} <strong>${sesion.device?.navegador || 'Navegador'}</strong> - ${sesion.device?.so || 'SO desconocido'}<br>
            <small style="color: #6c757d;">📍 ${ubicacion}</small>
          </div>
        `;
      })
      .join('');

    Swal.fire({
      title: '⚠️ Sesiones Activas Detectadas',
      html: `
        <div style="text-align: left;">
          <p><strong>Tienes ${sesiones.length} sesión(es) activa(s) en:</strong></p>
          ${sesionesHTML}
          <br>
          <p style="color: #dc3545;"><strong>¿Deseas cerrar estas sesiones y continuar?</strong></p>
          <p style="font-size: 0.9em; color: #6c757d;">
            Al confirmar, todas las sesiones activas se cerrarán y solo permanecerá esta nueva sesión.
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesiones',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Usuario confirmó, proceder con login (esto cerrará las otras sesiones en el backend)
        this.procederConLogin(true, nuevaUbicacion);
      } else {
        // Usuario canceló
        this.isLoginFormSubmitted = false;
      }
    });
  }

  /**
   * Procede con el login normal
   */
  private procederConLogin(cerrarOtrasSesiones: boolean = false, nuevaUbicacion?: any): void {
    // Proceder con el login
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

          // Mostrar mensaje de bienvenida con ubicación (opcional)
          this.mostrarBienvenidaConUbicacion(mensajeBienvenida);

          // Navegar al Dashboard
          this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
        }
        // Navegar al Dashboard
        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
      },
      (err) => {
        Swal.fire({ icon: 'error', html: `${err.error.msg}` });
        this.isLoginFormSubmitted = false;
      },
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
        this.submitted = false;
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

  /**
   * Muestra mensaje de bienvenida con información de ubicación (opcional).
   * Obtiene la ubicación de la sesión actual del backend y la muestra al usuario.
   *
   * @param mensajeBienvenida - Mensaje de bienvenida personalizado
   */
  private mostrarBienvenidaConUbicacion(mensajeBienvenida: string): void {
    // Opción 1: Toast simple sin ubicación (comportamiento original)
    const mostrarUbicacion = false; // Cambiar a true para activar

    if (!mostrarUbicacion) {
      Swal.fire({
        position: 'bottom-end',
        html: mensajeBienvenida,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    // Opción 2: Obtener ubicación del backend y mostrar
    this.userSessionService.getUbicacionSesionActual().subscribe({
      next: (ubicacionInfo: any) => {
        const ciudad = ubicacionInfo.ciudad || 'Ubicación desconocida';
        const pais = ubicacionInfo.pais || '';
        const dispositivo = ubicacionInfo.dispositivo || 'Dispositivo desconocido';
        const ubicacion = pais ? `${ciudad}, ${pais}` : ciudad;

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: mensajeBienvenida,
          html: `
            <div class="text-start">
              <small class="text-muted">
                <i class="fas fa-map-marker-alt me-2"></i>${ubicacion}<br>
                <i class="fas fa-laptop me-2"></i>${dispositivo}
              </small>
            </div>
          `,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
      error: (error) => {
        // Si falla la obtención de ubicación, mostrar mensaje simple
        console.warn('No se pudo obtener la ubicación de la sesión:', error);
        Swal.fire({
          position: 'bottom-end',
          html: mensajeBienvenida,
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  }
}
