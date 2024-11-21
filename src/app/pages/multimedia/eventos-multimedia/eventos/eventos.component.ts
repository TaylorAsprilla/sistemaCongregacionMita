import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LinkEventoModel, TIPOEVENTO, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';
import Swal from 'sweetalert2';
import { NgIf, NgFor } from '@angular/common';
import { CargandoInformacionComponent } from '../../../../components/cargando-informacion/cargando-informacion.component';

@Component({
    selector: 'app-eventos',
    templateUrl: './eventos.component.html',
    styleUrls: ['./eventos.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        CargandoInformacionComponent,
        NgFor,
    ],
})
export class EventosComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public linkEventos: LinkEventoModel[] = [];
  public linkEventosSubscription: Subscription;
  public tipoEventoSubscription: Subscription;

  constructor(private router: Router, private linkEventosService: LinkEventosService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  ngOnDestroy(): void {
    this.linkEventosSubscription?.unsubscribe();
  }

  cargarEventos() {
    this.cargando = true;
    this.linkEventosSubscription = this.linkEventosService.getEventos().subscribe((linkEvento: LinkEventoModel[]) => {
      this.linkEventos = linkEvento.filter((linkEvento) => linkEvento.estado === true);
      this.cargando = false;
    });
  }

  buscarTipoDeEvento(idTipoEvento: number) {
    if (idTipoEvento === TIPOEVENTO_ID.SERVICIO) {
      return TIPOEVENTO.SERVICIO;
    } else if (idTipoEvento === TIPOEVENTO_ID.VIGILIA) {
      return TIPOEVENTO.VIGILIA;
    } else if (idTipoEvento === TIPOEVENTO_ID.EVENTO_ESPECIAL) {
      return TIPOEVENTO.EVENTO_ESPECIAL;
    }
    return null;
  }

  borrarEvento(evento: LinkEventoModel) {
    Swal.fire({
      title: '¿Borrar el evento?',
      text: `Esta seguro de borrar el evento de ${evento.titulo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.linkEventosService.eliminarEvento(evento).subscribe((eventoEliminado: any) => {
          Swal.fire('¡Deshabilitado!', `El evento ${evento.titulo} fue deshabilitado correctamente`, 'success');

          this.cargarEventos();
        });
      }
    });
  }

  activarEvento(evento: LinkEventoModel) {
    Swal.fire({
      title: 'Activar Evento',
      text: `Esta seguro de activar el evento de ${evento.titulo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.linkEventosService.activarEvento(evento).subscribe((eventoActivo: any) => {
          Swal.fire('¡Activado!', `El evento ${evento.titulo} fue activado correctamente`, 'success');

          this.cargarEventos();
        });
      }
    });
  }

  agregarABiblioteca(evento: LinkEventoModel) {
    Swal.fire({
      title: 'Biblioteca',
      text: `¿Desea agregar ${evento.titulo} a la biblioteca?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.linkEventosService.agregarABiblioteca(evento).subscribe((evento: any) => {
          Swal.fire(
            'Biblioteca',
            `El evento ${evento.linkEvento.titulo} se agregó a la biblioteca satisfactoriamente`,
            'success'
          );
          this.cargarEventos();
        });
      }
    });
  }

  eliminarDeLaBiblioteca(evento: LinkEventoModel) {
    Swal.fire({
      title: 'Biblioteca',
      text: `¿Desea eliminar ${evento.titulo} de la biblioteca?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.linkEventosService.eliminarDeLaBiblioteca(evento).subscribe((evento: any) => {
          Swal.fire(
            'Biblioteca',
            `El evento ${evento.linkEvento.titulo} se eliminó de la biblioteca satisfactoriamente`,
            'success'
          );
          this.cargarEventos();
        });
      }
    });
  }

  actualizarEvento(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.EVENTOS}/${id}`);
  }

  crearEvento() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.EVENTOS}/${nuevo}`);
  }
}
