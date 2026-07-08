import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LinkEventoModel, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';
import { CargandoInformacionComponent } from 'src/app/components/cargando-informacion/cargando-informacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-biblioteca',
  templateUrl: './agregar-biblioteca.component.html',
  styleUrls: ['./agregar-biblioteca.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CargandoInformacionComponent],
})
export class AgregarBibliotecaComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private linkEventosService = inject(LinkEventosService);

  readonly TIPOEVENTO_ID = TIPOEVENTO_ID;

  eventoForm!: FormGroup;
  eventos: LinkEventoModel[] = [];
  eventoSeleccionado: LinkEventoModel | null = null;
  cargando = false;

  private eventosSubscription?: Subscription;

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarEventos();
  }

  ngOnDestroy(): void {
    this.eventosSubscription?.unsubscribe();
  }

  crearFormulario(): void {
    this.eventoForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      link: ['', [Validators.required, Validators.minLength(10)]],
      fecha: ['', [Validators.required]],
      tipoEvento_id: [null, [Validators.required]],
    });
  }

  cargarEventos(): void {
    this.cargando = true;
    this.eventosSubscription = this.linkEventosService.getEventos().subscribe({
      next: (eventos: LinkEventoModel[]) => {
        this.eventos = eventos.filter((e) => e.eventoEnBiblioteca === true);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({ title: 'Error', text: 'No se pudieron cargar los eventos de la biblioteca', icon: 'error' });
      },
    });
  }

  guardarEvento(): void {
    if (this.eventoForm.invalid) {
      Swal.fire({ title: 'Formulario Incompleto', text: 'Complete todos los campos requeridos', icon: 'warning' });
      return;
    }
    if (this.eventoSeleccionado) {
      this.actualizarEvento();
    } else {
      this.crearEvento();
    }
  }

  crearEvento(): void {
    const { titulo, link, fecha, tipoEvento_id } = this.eventoForm.value;
    const nuevoEvento = {
      titulo,
      link,
      fecha: new Date(fecha).toISOString(),
      tipoEvento_id,
      plataforma: 'swarmify',
      estado: true,
      eventoEnBiblioteca: true,
    };

    this.linkEventosService.crearEvento(nuevoEvento as unknown as LinkEventoModel).subscribe({
      next: () => {
        Swal.fire({ title: '¡Éxito!', text: `Evento "${titulo}" agregado a la biblioteca`, icon: 'success' });
        this.resetFormulario();
        this.cargarEventos();
      },
      error: (error) => {
        const mensajeError = error.error?.mensaje || 'Error al crear el evento';
        Swal.fire({ title: 'Error', text: mensajeError, icon: 'error' });
      },
    });
  }

  actualizarEvento(): void {
    if (!this.eventoSeleccionado) return;
    const { titulo, link, fecha, tipoEvento_id } = this.eventoForm.value;
    const eventoActualizado: LinkEventoModel = {
      ...this.eventoSeleccionado,
      titulo,
      link,
      fecha: new Date(fecha),
      tipoEvento_id,
    };

    this.linkEventosService.actualizarEvento(eventoActualizado).subscribe({
      next: () => {
        Swal.fire({ title: '¡Actualizado!', text: `Evento "${titulo}" actualizado correctamente`, icon: 'success' });
        this.resetFormulario();
        this.cargarEventos();
      },
      error: () => {
        Swal.fire({ title: 'Error', text: 'No se pudo actualizar el evento', icon: 'error' });
      },
    });
  }

  seleccionarEvento(evento: LinkEventoModel): void {
    this.eventoSeleccionado = evento;
    const fechaStr = new Date(evento.fecha).toISOString().split('T')[0];
    this.eventoForm.patchValue({
      titulo: evento.titulo,
      link: evento.link,
      fecha: fechaStr,
      tipoEvento_id: evento.tipoEvento_id,
    });
  }

  eliminarEvento(evento: LinkEventoModel): void {
    Swal.fire({
      title: '¿Eliminar evento?',
      text: `¿Desea eliminar "${evento.titulo}" de la biblioteca?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.linkEventosService.eliminarEvento(evento).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', `El evento "${evento.titulo}" fue eliminado correctamente`, 'success');
            this.cargarEventos();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el evento', 'error'),
        });
      }
    });
  }

  resetFormulario(): void {
    this.eventoSeleccionado = null;
    this.eventoForm.reset({ tipoEvento_id: null });
  }

  obtenerNombreTipoEvento(id: number): string {
    const map: Record<number, string> = {
      [TIPOEVENTO_ID.SERVICIO]: 'Servicio',
      [TIPOEVENTO_ID.VIGILIA]: 'Vigilia',
      [TIPOEVENTO_ID.EVENTO_ESPECIAL]: 'Evento Especial',
    };
    return map[id] ?? 'Desconocido';
  }
}
