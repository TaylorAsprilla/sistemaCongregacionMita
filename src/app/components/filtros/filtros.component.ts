import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-filtros',
    templateUrl: './filtros.component.html',
    styleUrls: ['./filtros.component.scss'],
    standalone: true,
    imports: [FormsModule],
})
export class FiltrosComponent implements OnInit {
  @Output() onFiltroNombre: EventEmitter<string> = new EventEmitter<string>();
  filtroNombre: string = '';

  constructor() {}

  ngOnInit(): void {}

  filtrar() {
    this.onFiltroNombre.emit(this.filtroNombre);
  }
}
