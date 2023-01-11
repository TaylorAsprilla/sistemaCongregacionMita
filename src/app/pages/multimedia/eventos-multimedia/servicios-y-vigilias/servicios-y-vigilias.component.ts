import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkEventoModel, PLATAFORMA, TIPOEVENTO } from 'src/app/core/models/link-evento.model';

@Component({
  selector: 'app-servicios-y-vigilias',
  templateUrl: './servicios-y-vigilias.component.html',
  styleUrls: ['./servicios-y-vigilias.component.scss'],
})
export class ServiciosYVigiliasComponent implements OnInit {
  linkEventos: LinkEventoModel[] = [];

  get TIPOEVENTO() {
    return TIPOEVENTO;
  }

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { linkEventos: LinkEventoModel[] }) => {
      this.linkEventos = data.linkEventos;
    });
  }

  get servicios() {
    return this.linkEventos.filter((eventos) => eventos.tipoEvento_id === TIPOEVENTO.SERVICIO).slice(0, 1);
  }

  get vigilias() {
    return this.linkEventos.filter((eventos) => eventos.tipoEvento_id === TIPOEVENTO.VIGILIA).slice(0, 1);
  }

  get eventos() {
    return this.linkEventos.filter((eventos) => eventos.tipoEvento_id === TIPOEVENTO.EVENTO_ESPECIAL).slice(0, 1);
  }
}
