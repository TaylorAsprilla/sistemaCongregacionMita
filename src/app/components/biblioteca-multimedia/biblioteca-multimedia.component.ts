import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkEventoModel, TIPOEVENTO } from 'src/app/core/models/link-evento.model';

@Component({
  selector: 'app-biblioteca-multimedia',
  templateUrl: './biblioteca-multimedia.component.html',
  styleUrls: ['./biblioteca-multimedia.component.scss'],
})
export class BibliotecaMultimediaComponent implements OnInit {
  @Input() serviciosYvigilias: LinkEventoModel[] = [];
  @Input() titulo: string = '';

  constructor() {}

  ngOnInit(): void {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    console.log(this.serviciosYvigilias);
  }
}
