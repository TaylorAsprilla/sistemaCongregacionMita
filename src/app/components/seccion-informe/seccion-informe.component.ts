import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-seccion-informe',
  templateUrl: './seccion-informe.component.html',
  styleUrls: ['./seccion-informe.component.css'],
  standalone: true,
  imports: [RouterLink, NgClass],
})
export class SeccionInformeComponent {
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() ruta: string = '';
  @Input() imagen: string = '';
  @Input() estatus: string = '';
  @Input() color: string = '';
}
