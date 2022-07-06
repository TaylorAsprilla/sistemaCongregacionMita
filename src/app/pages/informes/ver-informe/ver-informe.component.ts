import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-ver-informe',
  templateUrl: './ver-informe.component.html',
  styleUrls: ['./ver-informe.component.css'],
})
export class VerInformeComponent implements OnInit {
  @ViewChild('content', { static: false }) el!: ElementRef;

  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundApellido: string;
  fechaActual: Date;
  constructor() {}

  ngOnInit(): void {
    this.primerNombre = sessionStorage.getItem('primerNombre');
    this.segundoNombre = sessionStorage.getItem('segundoNombre');
    this.primerApellido = sessionStorage.getItem('primerApellido');
    this.segundApellido = sessionStorage.getItem('segundoApellido');
    this.fechaActual = new Date();
  }

  makePDF(obrero: string, fecha: string) {
    let pdf = new jsPDF('p', 'pt', 'a4');
    // pdf.setFont('helvetica', 'bold');
    // pdf.text('Congregación Mita Inc.', 20, 50, null, 'center');
    // Texto insertado a mano
    // pdf.text(fecha, 25, 25);
    // pdf.text(obrero, 25, 35);
    // pdf.save('informe.pdf');

    // Guardar elemento html
    // pdf.canvas.height = 80 * 11;
    // pdf.canvas.width = 80 * 8.5;
    console.log(obrero);
    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        // texto insertado
        pdf.text(fecha, 25, 25);
        pdf.text(obrero, 25, 35);

        pdf.save('informe.pdf');
      },
    });
  }
}
