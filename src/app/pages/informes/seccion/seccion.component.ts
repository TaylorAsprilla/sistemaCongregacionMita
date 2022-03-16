import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['/seccion.component.css'],
})
export class SeccionComponent implements OnInit {
  @Input('nombre') name: string = '';
  @Input('descripcion') description: string = '';
  @Input('ruta') path: string = '';
  @Input('imagen') image: string = '';
  @Input('estatus') status: string = '';

  constructor() {}

  ngOnInit(): void {}
}
