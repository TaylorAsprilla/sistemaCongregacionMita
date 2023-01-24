import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LinkEventoModel, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';

@Component({
  selector: 'app-vigilias',
  templateUrl: './vigilias.component.html',
  styleUrls: ['./vigilias.component.scss'],
})
export class VigiliasComponent implements OnInit, OnDestroy {
  linkEventos: LinkEventoModel[] = [];
  vigilias: LinkEventoModel[] = [];
  linEventosSubscription: Subscription;

  get TIPOEVENTO() {
    return TIPOEVENTO_ID;
  }

  constructor(private linkEventosService: LinkEventosService) {}

  ngOnInit(): void {
    this.linEventosSubscription = this.linkEventosService.getEventos().subscribe((eventos: LinkEventoModel[]) => {
      this.linkEventos = eventos;
      this.vigilias = this.linkEventos.filter(
        (vigilia) => vigilia.tipoEvento_id === TIPOEVENTO_ID.VIGILIA && vigilia.eventoEnBiblioteca === true
      );
    });
  }

  ngOnDestroy(): void {
    this.linEventosSubscription?.unsubscribe();
  }
}
