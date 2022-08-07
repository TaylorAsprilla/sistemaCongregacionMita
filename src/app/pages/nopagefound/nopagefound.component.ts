import { Component, OnInit } from '@angular/core';
import { Rutas } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.css'],
})
export class NopagefoundComponent implements OnInit {
  fecha = new Date();

  year = new Date().getFullYear();

  get Rutas() {
    return Rutas;
  }

  constructor() {}

  ngOnInit(): void {}
}
