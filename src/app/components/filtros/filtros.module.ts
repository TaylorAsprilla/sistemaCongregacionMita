import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrosComponent } from './filtros.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FiltrosComponent],
  imports: [CommonModule, FormsModule],
  exports: [FiltrosComponent],
})
export class FiltrosModule {}
