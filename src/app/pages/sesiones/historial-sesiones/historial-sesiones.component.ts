import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UserSessionService } from 'src/app/services/user-session/user-session.service';
import { UserSessionInterface, UserSessionDisplayInterface } from 'src/app/core/interfaces/user-session.interface';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

/**
 * Componente para mostrar y gestionar el historial de sesiones del usuario.
 *
 * Características:
 * - Lista de todas las sesiones (activas e inactivas)
 * - Información de dispositivo, ubicación y fecha de cada sesión
 * - Capacidad de cerrar sesiones individuales
 * - Opción de cerrar todas las sesiones excepto la actual
 * - Indicador visual de la sesión actual
 *
 * @example
 * <!-- En el HTML -->
 * <app-historial-sesiones></app-historial-sesiones>
 */
@Component({
  selector: 'app-historial-sesiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-sesiones.component.html',
  styleUrls: ['./historial-sesiones.component.scss'],
})
export class HistorialSesionesComponent implements OnInit, OnDestroy {
  private userSessionService = inject(UserSessionService);
  private usuarioService = inject(UsuarioService);

  sesiones: UserSessionDisplayInterface[] = [];
  sesionesOriginales: UserSessionInterface[] = [];
  cargando: boolean = true;
  error: string | null = null;

  private sesionesSubscription: Subscription;

  ngOnInit(): void {
    this.cargarSesiones();
  }

  ngOnDestroy(): void {
    this.sesionesSubscription?.unsubscribe();
  }

  /**
   * Carga el historial de sesiones del usuario
   */
  cargarSesiones(): void {
    this.cargando = true;
    this.error = null;

    this.sesionesSubscription = this.userSessionService.getSesionesUsuario().subscribe({
      next: (sesiones) => {
        this.sesionesOriginales = sesiones;
        this.sesiones = this.userSessionService.transformarParaUI(sesiones, this.usuarioService.token);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando sesiones:', error);
        this.error = 'No se pudieron cargar las sesiones. Por favor, intenta de nuevo.';
        this.cargando = false;
      },
    });
  }

  /**
   * Cierra una sesión específica
   *
   * @param sesion - Sesión a cerrar
   */
  cerrarSesion(sesion: UserSessionDisplayInterface): void {
    if (sesion.esActual) {
      Swal.fire({
        title: '⚠️ No puedes cerrar tu sesión actual',
        text: 'Si deseas cerrar esta sesión, usa el botón "Cerrar Sesión" en el menú.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    Swal.fire({
      title: '¿Cerrar esta sesión?',
      html: `
        <p>Se cerrará la sesión iniciada desde:</p>
        <p><strong>${sesion.dispositivo}</strong></p>
        <p>${sesion.ubicacion}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmarCierreSesion(sesion.id);
      }
    });
  }

  /**
   * Cierra todas las sesiones excepto la actual
   */
  cerrarTodasLasSesiones(): void {
    const sesionesActivas = this.sesiones.filter((s) => s.activa && !s.esActual);

    if (sesionesActivas.length === 0) {
      Swal.fire({
        title: 'No hay otras sesiones activas',
        text: 'Solo tienes tu sesión actual abierta.',
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    Swal.fire({
      title: `¿Cerrar ${sesionesActivas.length} sesión${sesionesActivas.length > 1 ? 'es' : ''}?`,
      html: `
        <p>Se cerrarán todas las sesiones activas excepto la actual.</p>
        <p>Los dispositivos afectados deberán iniciar sesión nuevamente.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, cerrar ${sesionesActivas.length} sesión${sesionesActivas.length > 1 ? 'es' : ''}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmarCierreTodasSesiones();
      }
    });
  }

  /**
   * Ejecuta el cierre de una sesión y actualiza la lista
   */
  private confirmarCierreSesion(sessionId: number): void {
    this.userSessionService.cerrarSesion(sessionId).subscribe({
      next: () => {
        Swal.fire({
          title: '✅ Sesión cerrada',
          text: 'La sesión se cerró correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        this.cargarSesiones();
      },
      error: (error) => {
        console.error('Error cerrando sesión:', error);
        Swal.fire({
          title: '❌ Error',
          text: 'No se pudo cerrar la sesión. Por favor, intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      },
    });
  }

  /**
   * Ejecuta el cierre de todas las sesiones excepto la actual
   */
  private confirmarCierreTodasSesiones(): void {
    this.userSessionService.cerrarTodasLasSesiones().subscribe({
      next: () => {
        Swal.fire({
          title: '✅ Sesiones cerradas',
          text: 'Todas las sesiones excepto la actual se cerraron correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        this.cargarSesiones();
      },
      error: (error) => {
        console.error('Error cerrando sesiones:', error);
        Swal.fire({
          title: '❌ Error',
          text: 'No se pudieron cerrar las sesiones. Por favor, intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      },
    });
  }

  /**
   * Obtiene el icono apropiado para el tipo de dispositivo
   */
  getIconoDispositivo(dispositivo: string): string {
    return this.userSessionService.getIconoDispositivo(dispositivo);
  }

  /**
   * Formatea una fecha para mostrarla de forma legible
   */
  formatearFecha(fecha: Date | string): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const ahora = new Date();
    const diferencia = ahora.getTime() - fechaObj.getTime();

    // Si fue hace menos de 1 hora
    if (diferencia < 3600000) {
      const minutos = Math.floor(diferencia / 60000);
      return minutos < 1 ? 'Ahora mismo' : `Hace ${minutos} min`;
    }

    // Si fue hoy
    if (
      fechaObj.getDate() === ahora.getDate() &&
      fechaObj.getMonth() === ahora.getMonth() &&
      fechaObj.getFullYear() === ahora.getFullYear()
    ) {
      return `Hoy ${fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Si fue ayer
    const ayer = new Date(ahora);
    ayer.setDate(ayer.getDate() - 1);
    if (
      fechaObj.getDate() === ayer.getDate() &&
      fechaObj.getMonth() === ayer.getMonth() &&
      fechaObj.getFullYear() === ayer.getFullYear()
    ) {
      return `Ayer ${fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Fecha completa
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Cuenta cuántas sesiones activas hay (excepto la actual)
   */
  contarSesionesActivas(): number {
    return this.sesiones.filter((s) => s.activa && !s.esActual).length;
  }
}
