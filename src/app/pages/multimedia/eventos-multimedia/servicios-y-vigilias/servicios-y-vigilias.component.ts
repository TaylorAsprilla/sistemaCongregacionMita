import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LinkEventoModel, PLATAFORMA, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';

@Component({
  selector: 'app-servicios-y-vigilias',
  templateUrl: './servicios-y-vigilias.component.html',
  styleUrls: ['./servicios-y-vigilias.component.scss'],
})
export class ServiciosYVigiliasComponent implements OnInit, OnDestroy {
  linkEventos: LinkEventoModel[] = [];

  linEventosSubscription: Subscription;

  get TIPOEVENTO() {
    return TIPOEVENTO_ID;
  }

  constructor(private linkEventosService: LinkEventosService) {}

  ngOnInit(): void {
    this.linEventosSubscription = this.linkEventosService.getEventos().subscribe((eventos: LinkEventoModel[]) => {
      this.linkEventos = eventos;
    });
  }

  ngOnDestroy(): void {
    this.linEventosSubscription?.unsubscribe();
  }

  get servicios() {
    return this.linkEventos.filter((eventos) => eventos.tipoEvento_id === TIPOEVENTO_ID.SERVICIO).slice(0, 1);
  }

  get vigilias() {
    return this.linkEventos.filter((eventos) => eventos.tipoEvento_id === TIPOEVENTO_ID.VIGILIA).slice(0, 1);
  }

  get eventos() {
    return this.linkEventos.filter((eventos) => eventos.tipoEvento_id === TIPOEVENTO_ID.EVENTO_ESPECIAL).slice(0, 1);
  }
}
