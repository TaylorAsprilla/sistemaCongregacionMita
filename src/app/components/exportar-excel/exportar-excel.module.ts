import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportarExcelComponent } from './exportar-excel.component';

@NgModule({
    imports: [CommonModule, ExportarExcelComponent],
    exports: [ExportarExcelComponent],
})
export class ExportarExcelModule {}
