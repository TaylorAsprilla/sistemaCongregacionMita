import { Component, OnInit } from '@angular/core';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.css'],
  standalone: true,
})
export class NopagefoundComponent {
  fecha = new Date();

  year = new Date().getFullYear();

  get Rutas() {
    return RUTAS;
  }
}
