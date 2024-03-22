import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerCensoComponent } from './ver-censo.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ExportarExcelModule } from '../exportar-excel/exportar-excel.module';

@NgModule({
  declarations: [VerCensoComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, PipesModule, ExportarExcelModule],
  exports: [VerCensoComponent],
})
export class VerCensoModule {}
