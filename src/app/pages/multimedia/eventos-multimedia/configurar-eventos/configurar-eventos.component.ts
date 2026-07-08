import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RUTAS } from 'src/app/routes/menu-items';
import { EventoEnVivoService } from 'src/app/services/evento-en-vivo/evento-en-vivo.service';
import {
  EventoEnVivo,
  EventoEnVivoResponse,
  EventosEnVivoResponse,
} from 'src/app/core/interfaces/evento-en-vivo.interface';
import { CargandoInformacionComponent } from 'src/app/components/cargando-informacion/cargando-informacion.component';
import Swal from 'sweetalert2';
import { PLATAFORMAENUM, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';

/**
 * Componente para configurar EVENTOS EN VIVO (Sistema Nuevo)
 * API: /api/evento-en-vivo
 * Plataformas: YouTube, Vimeo, AntMedia
 */
@Component({
  selector: 'app-configurar-eventos',
  templateUrl: './configurar-eventos.component.html',
  styleUrls: ['./configurar-eventos.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CargandoInformacionComponent],
})
export class ConfigurarEventosComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private eventoEnVivoService = inject(EventoEnVivoService);

  readonly PLATAFORMA = PLATAFORMAENUM;
  readonly TIPOEVENTO_ID = TIPOEVENTO_ID;

  eventosForm!: FormGroup;
  eventosEnVivo: EventoEnVivo[] = [];
  eventoSeleccionado: EventoEnVivo | null = null;
  cargandoEventos = false;

  private eventosSubscription?: Subscription;

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarEventos();

    // Verificar si estamos editando un evento
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id && id !== 'nuevo') {
        this.cargarEventoPorId(Number(id));
      }
    });
  }

  ngOnDestroy(): void {
    this.eventosSubscription?.unsubscribe();
  }

  crearFormulario(): void {
    this.eventosForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.minLength(10)]],
      linkTransmision: ['', [Validators.required, Validators.minLength(10)]],
      plataforma: [null, [Validators.required]],
      tipoEvento_id: [null, [Validators.required]],
    });
  }

  cargarEventos(): void {
    this.cargandoEventos = true;
    this.eventosSubscription = this.eventoEnVivoService.obtenerEventos().subscribe({
      next: (response: EventosEnVivoResponse) => {
        this.eventosEnVivo = response.eventosEnVivo || [];
        this.cargandoEventos = false;
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.cargandoEventos = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los eventos en vivo',
          icon: 'error',
        });
      },
    });
  }

  cargarEventoPorId(id: number): void {
    this.eventoEnVivoService.obtenerEventoPorId(id).subscribe({
      next: (response) => {
        this.eventoSeleccionado = response.eventoEnVivo;
        const { titulo, descripcion, linkTransmision, plataforma, tipoEvento_id } = response.eventoEnVivo;
        this.eventosForm.patchValue({
          titulo,
          descripcion,
          linkTransmision,
          plataforma,
          tipoEvento_id,
        });
      },
      error: (error) => {
        console.error('Error al cargar evento:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el evento seleccionado',
          icon: 'error',
        });
        this.router.navigate([`/${RUTAS.SISTEMA}/${RUTAS.CONFIGURAR_SERVICIOS_Y_VIGILIAS}`]);
      },
    });
  }

  guardarEvento(): void {
    if (this.eventosForm.invalid) {
      Swal.fire({
        title: 'Formulario Incompleto',
        text: 'Por favor complete todos los campos requeridos',
        icon: 'warning',
      });
      return;
    }

    if (this.eventoSeleccionado?.id) {
      this.actualizarEvento();
    } else {
      this.crearEvento();
    }
  }

  crearEvento(): void {
    const nuevoEvento: EventoEnVivo = {
      ...this.eventosForm.value,
      estado: true,
    };

    this.eventoEnVivoService.crearEvento(nuevoEvento).subscribe({
      next: (response) => {
        const titulo = response.eventoEnVivo.titulo;

        Swal.fire({
          title: '¡Éxito!',
          text: `Evento "${titulo}" creado correctamente`,
          icon: 'success',
        });
        this.resetFormulario();
        this.cargarEventos();
      },
      error: (error) => {
        console.error('Error al crear evento:', error);
        const mensajeError = error.error?.mensaje || 'Error al crear el evento';
        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
        });
      },
    });
  }

  actualizarEvento(): void {
    if (!this.eventoSeleccionado?.id) return;

    const eventoActualizado = this.eventosForm.value;

    this.eventoEnVivoService.actualizarEvento(this.eventoSeleccionado.id, eventoActualizado).subscribe({
      next: (response) => {
        const eventoModificado = (response.eventoEnVivo || response) as EventoEnVivo;
        const titulo = eventoModificado.titulo || 'el evento';

        Swal.fire({
          title: '¡Actualizado!',
          text: `Evento "${titulo}" actualizado correctamente`,
          icon: 'success',
        });
        this.resetFormulario();
        this.router.navigate([`/${RUTAS.SISTEMA}/${RUTAS.CONFIGURAR_SERVICIOS_Y_VIGILIAS}`]);
      },
      error: (error) => {
        console.error('Error al actualizar evento:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el evento',
          icon: 'error',
        });
      },
    });
  }

  seleccionarEvento(evento: EventoEnVivo): void {
    this.eventoSeleccionado = evento;
    const { titulo, descripcion, linkTransmision, plataforma, tipoEvento_id } = evento;
    this.eventosForm.patchValue({
      titulo,
      descripcion,
      linkTransmision,
      plataforma,
      tipoEvento_id,
    });
  }

  eliminarEvento(evento: EventoEnVivo): void {
    if (!evento.id) return;

    Swal.fire({
      title: '¿Eliminar Evento?',
      text: `¿Está seguro de eliminar "${evento.titulo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed && evento.id) {
        this.eventoEnVivoService.eliminarEvento(evento.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El evento ha sido eliminado', 'success');
            this.cargarEventos();
            if (this.eventoSeleccionado?.id === evento.id) {
              this.resetFormulario();
            }
          },
          error: (error) => {
            console.error('Error al eliminar evento:', error);
            Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
          },
        });
      }
    });
  }

  cambiarEstado(evento: EventoEnVivo): void {
    if (!evento.id) return;

    const nuevoEstado = !evento.estado;
    this.eventoEnVivoService.cambiarEstadoEvento(evento.id, nuevoEstado).subscribe({
      next: () => {
        evento.estado = nuevoEstado;
        const estado = nuevoEstado ? 'activado' : 'desactivado';
        Swal.fire('¡Listo!', `Evento ${estado} correctamente`, 'success');
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
        Swal.fire('Error', 'No se pudo cambiar el estado del evento', 'error');
      },
    });
  }

  resetFormulario(): void {
    this.eventosForm.reset({
      titulo: '',
      descripcion: '',
      linkTransmision: '',
      plataforma: null,
      tipoEvento_id: null,
    });
    this.eventoSeleccionado = null;
  }

  obtenerIconoPlataforma(plataforma: string): string {
    const iconos: Record<string, string> = {
      youtube: 'fa-youtube text-danger',
      vimeo: 'fa-vimeo text-info',
      antmedia: 'fa-broadcast-tower text-success',
    };
    return iconos[plataforma] || 'fa-video';
  }

  obtenerNombreTipoEvento(tipoId: number): string {
    const nombres: Record<number, string> = {
      1: 'Servicio',
      2: 'Vigilia',
      3: 'Evento Especial',
    };
    return nombres[tipoId] || 'Desconocido';
  }
}
