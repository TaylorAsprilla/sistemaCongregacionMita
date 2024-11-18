import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LinkEventoModel, PLATAFORMA, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configurar-eventos',
  templateUrl: './configurar-eventos.component.html',
  styleUrls: ['./configurar-eventos.component.scss'],
})
export class ConfigurarEventosComponent implements OnInit, OnDestroy {
  eventosForm: FormGroup;

  linkEventos: LinkEventoModel[] = [];
  linkEventoSeleccionado: LinkEventoModel[] = [];

  linkEventosSubscription: Subscription;

  get PLATAFORMA() {
    return PLATAFORMA;
  }

  get TIPOEVENTO() {
    return TIPOEVENTO_ID;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private linkEventosService: LinkEventosService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarLinkEvento(id);
    });

    this.cargarEventos();
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.linkEventosSubscription?.unsubscribe();
  }

  crearFormulario() {
    this.eventosForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      link: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required, Validators.minLength(3)]],
      tipoEvento_id: ['', [Validators.required]],
      plataforma: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  cargarEventos() {
    this.linkEventosSubscription = this.linkEventosService.getEventos().subscribe((linkEvento: LinkEventoModel[]) => {
      this.linkEventos = linkEvento.filter((linkEvento) => linkEvento.estado === true);
    });
  }

  guardarEvento() {
    const servicio = this.eventosForm.value;

    if (!!this.linkEventoSeleccionado.length) {
      this.actualizarEvento();
    } else {
      this.linkEventosService.crearEvento(servicio).subscribe(
        (respuesta: any) => {
          Swal.fire('Evento', 'Se cargó el evento correctamente', 'success');
          this.resetFormulario();
          this.cargarEventos();
        },
        (error) => {
          const errores = error.error.errors as { [key: string]: { msg: string } };
          const listaErrores: string[] = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Eventos',
            icon: 'error',
            html: `Error al guardar el servicio <p> ${listaErrores.join('')}`,
          });
        }
      );
    }
  }

  actualizarEvento() {
    const idEvento = this.linkEventoSeleccionado[0].id;
    const data = { ...this.eventosForm.value, id: idEvento };

    this.linkEventosService.actualizarEvento(data).subscribe({
      next: (eventoActualizado: any) => {
        Swal.fire({
          title: 'Evento Actualizado',
          icon: 'success',
          html: `El evento ${eventoActualizado.eventoactualizado.titulo} se actualizó correctamente`,
        });
        this.resetFormulario();
        this.redirigirAEventos();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Hubo un error al actualizar el evento.',
        });
        console.error('Error al actualizar el evento:', error);
      },
    });
  }

  redirigirAEventos() {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.EVENTOS}`);
  }

  buscarLinkEvento(id: string) {
    if (id !== 'nuevo') {
      this.linkEventosService
        .getUnLinkEvento(Number(id))
        .pipe(delay(100))
        .subscribe(
          (linkEvento: LinkEventoModel) => {
            const { titulo, link, fecha, tipoEvento_id, plataforma } = linkEvento;
            this.linkEventoSeleccionado[0] = linkEvento;
            this.eventosForm.setValue({ titulo, link, fecha, tipoEvento_id, plataforma });
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores: string[] = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Eventos',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CAMPOS}`);
          }
        );
    }
  }

  resetFormulario() {
    this.eventosForm.reset();
  }
}
