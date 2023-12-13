import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
})
export class FiltrosComponent implements OnInit {
  @Output() filtroNombreChange: EventEmitter<string> = new EventEmitter<string>();
  filtroNombre: string = '';

  constructor() {}

  ngOnInit(): void {}

  filtrar() {
    this.filtroNombreChange.emit(this.filtroNombre);
  }
}
