import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { MensajeInformativo } from 'src/app/core/interfaces/mensaje-informativo.interface';
import { RUTAS } from 'src/app/routes/menu-items';
import { MensajesInformativosService } from 'src/app/services/mensajes-informativos/mensajes-informativos.service';
import { CargandoInformacionComponent } from '../../../../components/cargando-informacion/cargando-informacion.component';

type EstadoMensaje = 'Activo' | 'Inactivo' | 'Expirado' | 'Programado';

@Component({
  selector: 'app-mensajes-informativos',
  templateUrl: './mensajes-informativos.component.html',
  styleUrls: ['./mensajes-informativos.component.scss'],
  standalone: true,
  imports: [CommonModule, CargandoInformacionComponent],
})
export class MensajesInformativosComponent implements OnInit {
  private router = inject(Router);
  private mensajesInformativosService = inject(MensajesInformativosService);

  cargando = true;
  mensajes: MensajeInformativo[] = [];

  ngOnInit(): void {
    this.cargarMensajes();
  }

  cargarMensajes(): void {
    this.cargando = true;
    this.mensajesInformativosService.obtenerTodos().subscribe({
      next: (response) => {
        this.mensajes = response.mensajesInformativos || [];
        this.cargando = false;
      },
      error: () => {
        this.mensajes = [];
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los mensajes informativos', 'error');
      },
    });
  }

  estadoDe(mensaje: MensajeInformativo): EstadoMensaje {
    if (!mensaje.activo) {
      return 'Inactivo';
    }

    const ahora = new Date();
    const desde = new Date(mensaje.publicar_desde);
    const hasta = new Date(mensaje.publicar_hasta);

    if (hasta < ahora) {
      return 'Expirado';
    }

    if (desde > ahora) {
      return 'Programado';
    }

    return 'Activo';
  }

  claseEstado(estado: EstadoMensaje): string {
    switch (estado) {
      case 'Activo':
        return 'badge-success';
      case 'Programado':
        return 'badge-info';
      case 'Expirado':
        return 'badge-secondary';
      default:
        return 'badge-danger';
    }
  }

  resumen(mensaje: string, longitud = 80): string {
    if (!mensaje) {
      return '';
    }
    return mensaje.length > longitud ? `${mensaje.substring(0, longitud)}...` : mensaje;
  }

  crearMensaje(): void {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.MENSAJES_INFORMATIVOS}/nuevo`);
  }

  editarMensaje(id: number): void {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.MENSAJES_INFORMATIVOS}/${id}`);
  }

  cambiarEstado(mensaje: MensajeInformativo): void {
    const nuevoEstado = !mensaje.activo;

    Swal.fire({
      title: nuevoEstado ? '¿Activar mensaje?' : '¿Desactivar mensaje?',
      text: `Esta acción ${nuevoEstado ? 'activará' : 'desactivará'} el mensaje "${mensaje.titulo}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajesInformativosService.cambiarEstado(mensaje.id as number, nuevoEstado).subscribe({
          next: () => {
            Swal.fire('Listo', `El mensaje fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`, 'success');
            this.cargarMensajes();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el estado del mensaje', 'error');
          },
        });
      }
    });
  }

  eliminarMensaje(mensaje: MensajeInformativo): void {
    Swal.fire({
      title: '¿Eliminar mensaje?',
      text: `Esta acción eliminará permanentemente el mensaje "${mensaje.titulo}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajesInformativosService.eliminar(mensaje.id as number).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El mensaje informativo fue eliminado correctamente', 'success');
            this.cargarMensajes();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el mensaje informativo', 'error');
          },
        });
      }
    });
  }
}
