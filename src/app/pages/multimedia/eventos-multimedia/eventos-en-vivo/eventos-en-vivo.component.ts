import { Component } from '@angular/core';
import { ServiciosEnVivoComponent } from '../../../../components/servicios-en-vivo/servicios-en-vivo.component';

@Component({
  selector: 'app-eventos-en-vivo',
  templateUrl: './eventos-en-vivo.component.html',
  styleUrls: ['./eventos-en-vivo.component.scss'],
  standalone: true,
  imports: [ServiciosEnVivoComponent],
})
export class EventosEnVivoComponent {}
