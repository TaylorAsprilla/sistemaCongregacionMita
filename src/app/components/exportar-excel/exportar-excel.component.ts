import { Component, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { UsuariosPorCongregacionInterface } from 'src/app/core/interfaces/usuario.interface';

@Component({
  selector: 'app-exportar-excel',
  templateUrl: './exportar-excel.component.html',
  styleUrls: ['./exportar-excel.component.scss'],
})
export class ExportarExcelComponent implements OnInit {
  @Input() usuarios: UsuariosPorCongregacionInterface[] = [];
  @Input() nombreArchivo: string = '';

  constructor() {}

  ngOnInit(): void {}

  exportarExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.usuarios);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.nombreArchivo);

    const format = 'dd/MM/yyyy';
    const myDate = new Date();
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    const filename = this.nombreArchivo + '_' + formattedDate + '.xlsx';
    XLSX.writeFile(wb, filename);
  }
}
