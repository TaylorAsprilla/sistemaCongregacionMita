import { Component, OnInit } from '@angular/core';
import { generarSeccioninforme, Seccion } from 'src/app/interfaces/seccion.interface';
import { Rutas } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  // styleUrls: ['../informes.css'],
})
export class InformeComponent implements OnInit {
  get Rutas() {
    return Rutas;
  }

  public generarSeccioninforme: Seccion[] = generarSeccioninforme;

  constructor() {}

  ngOnInit(): void {}
}
