import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportarExcelService {
  exportToExcel(data: any[], fileName: string): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    if (data.length > 0) {
      worksheet.columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
      data.forEach((row) => {
        worksheet.addRow(row);
      });
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}_${new Date().getTime()}.xlsx`);
    });
  }
}
