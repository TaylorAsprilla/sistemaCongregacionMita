import { Component, OnInit, inject } from '@angular/core';
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
  private activatedRoute = inject(ActivatedRoute);

  informes: InformeModel[] = [];
  generarSeccioninforme: Seccion[] = generarSeccioninforme;

  diasFinTrimestre: number;

  currYear = new Date().getFullYear();

  trimestreActual = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  finPrimerTrimestre = new Date('april 1, ' + this.currYear + ' 00:00:00').getTime();
  finSegundoTrimestre = new Date('july 1, ' + this.currYear + ' 00:00:00').getTime();
  finTercerTrimestre = new Date('october 1, ' + this.currYear + ' 00:00:00').getTime();
  finCuartoTrimestre = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  trimestres = [this.finPrimerTrimestre, this.finSegundoTrimestre, this.finTercerTrimestre, this.finCuartoTrimestre];

  get Rutas() {
    return RUTAS;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { informes: InformeModel[] }) => {
      this.informes = data.informes;
    });

    this.diasFinTrimestre = this.calcularDiasFinTrimestre();
    console.log('Trimestre actual:', this.getTrimestresActual());
    console.log('Días para fin de trimestre:', this.diasFinTrimestre);
  }

  /**
   * Retorna el número del trimestre actual (1, 2, 3 o 4)
   * basándose en el mes actual
   */
  getTrimestresActual(): number {
    const mesActual = new Date().getMonth(); // 0-11 (0=Enero, 11=Diciembre)
    return Math.floor(mesActual / 3) + 1;
  }

  /**
   * Calcula cuántos días faltan para el fin del trimestre actual
   */
  calcularDiasFinTrimestre(): number {
    const ahora = new Date().getTime();
    const trimestreActual = this.getTrimestresActual();

    // Obtener la fecha de fin del trimestre actual
    const fechaFinTrimestre = this.trimestres[trimestreActual - 1];

    // Calcular la diferencia en milisegundos
    const diferencia = fechaFinTrimestre - ahora;

    // Convertir a días
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    return dias;
  }
}
