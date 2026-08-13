import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MensajeInformativo } from 'src/app/core/interfaces/mensaje-informativo.interface';

@Component({
  selector: 'app-mensajes-informativos-banner',
  templateUrl: './mensajes-informativos-banner.component.html',
  styleUrls: ['./mensajes-informativos-banner.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MensajesInformativosBannerComponent {
  @Input() mensajes: MensajeInformativo[] = [];
}
