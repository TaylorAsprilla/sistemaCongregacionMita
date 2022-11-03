import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkEventoModel } from 'src/app/core/models/link-evento.model';
import { SeccionInformeModel } from 'src/app/core/models/seccion-informe.model';

@Component({
  selector: 'app-servicios-y-vigilias',
  templateUrl: './servicios-y-vigilias.component.html',
  styleUrls: ['./servicios-y-vigilias.component.scss'],
})
export class ServiciosYVigiliasComponent implements OnInit {
  linkEventos: LinkEventoModel[] = [];
  servicio: LinkEventoModel;
  vigilia: LinkEventoModel;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { linkEventos: LinkEventoModel[] }) => {
      this.linkEventos = data.linkEventos;
    });

    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.servicio = this.linkEventos.filter((eventos) => eventos.tipoEvento_id === 1)[0];
    this.vigilia = this.linkEventos.filter((eventos) => eventos.tipoEvento_id === 2)[0];
  }
}
