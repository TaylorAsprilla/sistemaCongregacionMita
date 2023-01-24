import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LinkEventoModel, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit, OnDestroy {
  linkEventos: LinkEventoModel[] = [];
  servicios: LinkEventoModel[] = [];

  linEventosSubscription: Subscription;

  get TIPOEVENTO() {
    return TIPOEVENTO_ID;
  }

  constructor(private activatedRoute: ActivatedRoute, private linkEventosService: LinkEventosService) {}

  ngOnInit(): void {
    this.linEventosSubscription = this.linkEventosService.getEventos().subscribe((eventos: LinkEventoModel[]) => {
      this.linkEventos = eventos;
      this.servicios = this.linkEventos.filter(
        (servicio) => servicio.tipoEvento_id === TIPOEVENTO_ID.SERVICIO && servicio.eventoEnBiblioteca === true
      );
    });
  }

  ngOnDestroy(): void {
    this.linEventosSubscription?.unsubscribe();
  }
}
