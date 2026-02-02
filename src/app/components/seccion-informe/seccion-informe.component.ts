import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seccion-informe',
  templateUrl: './seccion-informe.component.html',
  styleUrls: ['./seccion-informe.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class SeccionInformeComponent {
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() ruta: string = '';
  @Input() imagen: string = '';
  @Input() estatus: string = '';
  @Input() color: string = '';


}
