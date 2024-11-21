import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-seccion-home',
    templateUrl: './seccion-home.component.html',
    styleUrls: ['./seccion-home.component.scss'],
    standalone: true,
    imports: [RouterLink],
})
export class SeccionHomeComponent implements OnInit {
  @Input() nombreSeccion: string = '';
  @Input() nombreResponsable: string = '';
  @Input() email: string = '';
  @Input() logo: string = '';
  @Input() ruta: string = '';

  constructor() {}

  ngOnInit(): void {}
}
