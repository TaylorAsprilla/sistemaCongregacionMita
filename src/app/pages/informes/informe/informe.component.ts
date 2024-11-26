import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { generarSeccioninforme, Seccion } from 'src/app/core/interfaces/seccion-informe.interface';
import { InformeModel } from 'src/app/core/models/informe.model';
import { RUTAS } from 'src/app/routes/menu-items';

import { SeccionInformeComponent } from '../../../components/seccion-informe/seccion-informe.component';

@Component({
    selector: 'app-informe',
    templateUrl: './informe.component.html',
    styleUrls: ['./informe.component.scss'],
    standalone: true,
    imports: [SeccionInformeComponent],
})
export class InformeComponent implements OnInit {
  get Rutas() {
    return RUTAS;
  }

  informes: InformeModel[] = [];

  public generarSeccioninforme: Seccion[] = generarSeccioninforme;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { informes: InformeModel[] }) => {
      this.informes = data.informes;
    });

    this.calcularDias();
  }

  currYear = new Date().getFullYear();

  trimestreActual = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  finPrimerTrimestre = new Date('april 1, ' + this.currYear + ' 00:00:00').getTime();
  finSegundoTrimestre = new Date('july 1, ' + this.currYear + ' 00:00:00').getTime();
  finTercerTrimestre = new Date('october 1, ' + this.currYear + ' 00:00:00').getTime();
  finCuartoTrimestre = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  trimestres = [this.finPrimerTrimestre, this.finSegundoTrimestre, this.finTercerTrimestre, this.finCuartoTrimestre];

  escogerTrimestre(finalTrimestreActual: number) {
    var ahora = new Date().getTime();

    for (var i = 0; i < this.trimestres.length; i++) {
      var distancia = this.trimestres[i] - ahora;

      if (distancia >= 0) {
        finalTrimestreActual = this.trimestres[i];
        break;
      }
    }

    return finalTrimestreActual;
  }

  demo: any;
  display: any;

  calcularDias() {
    var now = new Date().getTime();

    this.escogerTrimestre(this.trimestreActual);

    var distance = this.trimestreActual - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    this.demo = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
    this.display = days;
  }
}
