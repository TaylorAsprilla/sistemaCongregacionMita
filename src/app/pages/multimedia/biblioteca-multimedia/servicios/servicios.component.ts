import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkEventoModel, TIPOEVENTO } from 'src/app/core/models/link-evento.model';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
  linkEventos: LinkEventoModel[] = [];
  servicios: LinkEventoModel[] = [];
  vigilias: LinkEventoModel[] = [];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { linkEventos: LinkEventoModel[] }) => {
      this.linkEventos = data.linkEventos;
    });

    this.servicios = this.linkEventos.filter((servicio) => servicio.tipoEvento_id === TIPOEVENTO.SERVICIO);
  }
}
