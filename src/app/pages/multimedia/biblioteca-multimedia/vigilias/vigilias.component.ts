import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkEventoModel, TIPOEVENTO } from 'src/app/core/models/link-evento.model';

@Component({
  selector: 'app-vigilias',
  templateUrl: './vigilias.component.html',
  styleUrls: ['./vigilias.component.scss'],
})
export class VigiliasComponent implements OnInit {
  linkEventos: LinkEventoModel[] = [];
  vigilias: LinkEventoModel[] = [];

  get TIPOEVENTO() {
    return TIPOEVENTO;
  }

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { linkEventos: LinkEventoModel[] }) => {
      this.linkEventos = data.linkEventos;
    });

    this.vigilias = this.linkEventos.filter((vigilia) => vigilia.tipoEvento_id === TIPOEVENTO.VIGILIA);
  }
}
