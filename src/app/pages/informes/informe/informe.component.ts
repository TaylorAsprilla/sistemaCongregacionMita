import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { generarSeccioninforme, Seccion } from 'src/app/core/interfaces/seccion.interface';
import { InformeModel } from 'src/app/core/models/informe.model';
import { Rutas } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss'],
})
export class InformeComponent implements OnInit {
  get Rutas() {
    return Rutas;
  }

  informes: InformeModel[] = [];

  public generarSeccioninforme: Seccion[] = generarSeccioninforme;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { informes: InformeModel[] }) => {
      this.informes = data.informes;
    });
  }
}
