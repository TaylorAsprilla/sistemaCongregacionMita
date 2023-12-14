import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
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
