import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { LinkEventoModel, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';
import { ServiciosEnVivoComponent } from '../../../../components/servicios-en-vivo/servicios-en-vivo.component';

@Component({
  selector: 'app-eventos-en-vivo',
  templateUrl: './eventos-en-vivo.component.html',
  styleUrls: ['./eventos-en-vivo.component.scss'],
  standalone: true,
  imports: [ServiciosEnVivoComponent],
})
export class EventosEnVivoComponent implements OnInit {
  private linkEventosService = inject(LinkEventosService);

  linEventosSubscription: Subscription;

  servicio: LinkEventoModel;

  get TIPOEVENTO_ID() {
    return TIPOEVENTO_ID;
  }

  ngOnInit(): void {
    this.linEventosSubscription = this.linkEventosService.getLinkServicio().subscribe((evento: LinkEventoModel) => {
      this.servicio = evento;
    });
  }
}
