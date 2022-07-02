import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-seccion-informe',
  templateUrl: './seccion-informe.component.html',
  styleUrls: ['./seccion-informe.component.css'],
})
export class SeccionInformeComponent implements OnInit {
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() ruta: string = '';
  @Input() imagen: string = '';
  @Input() estatus: string = '';
  @Input() color: string = '';

  constructor() {}

  ngOnInit(): void {}
}
