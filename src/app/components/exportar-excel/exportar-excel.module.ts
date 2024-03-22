import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportarExcelComponent } from './exportar-excel.component';

@NgModule({
  declarations: [ExportarExcelComponent],
  imports: [CommonModule],
  exports: [ExportarExcelComponent],
})
export class ExportarExcelModule {}
