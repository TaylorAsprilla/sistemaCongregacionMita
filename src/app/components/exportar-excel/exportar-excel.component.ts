import { Component, Input, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { formatDate } from '@angular/common';
import { UsuariosPorCongregacionInterface } from 'src/app/core/interfaces/usuario.interface';

@Component({
  selector: 'app-exportar-excel',
  templateUrl: './exportar-excel.component.html',
  styleUrls: ['./exportar-excel.component.scss'],
  standalone: true,
})
export class ExportarExcelComponent {
  @Input() usuarios: UsuariosPorCongregacionInterface[] = [];
  @Input() nombreArchivo: string = '';

  exportarExcel(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    // Agregar encabezados
    worksheet.columns = Object.keys(this.usuarios[0]).map((key) => ({ header: key, key }));

    // Agregar filas
    this.usuarios.forEach((usuario) => {
      worksheet.addRow(usuario);
    });

    const format = 'dd/MM/yyyy';
    const myDate = new Date();
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    const filename = this.nombreArchivo + '_' + formattedDate + '.xlsx';

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, filename);
    });
  }
}
