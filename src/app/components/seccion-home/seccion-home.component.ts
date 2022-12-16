import { Component, Input, OnInit } from '@angular/core';
import { ROLES } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-seccion-home',
  templateUrl: './seccion-home.component.html',
  styleUrls: ['./seccion-home.component.scss'],
})
export class SeccionHomeComponent implements OnInit {
  @Input() nombreSeccion: string = '';
  @Input() nombreResponsable: string = '';
  @Input() email: string = '';
  @Input() logo: string = '';
  @Input() ruta: string = '';
  @Input() permisos: ROLES[] = [];

  constructor() {}

  ngOnInit(): void {}
}
