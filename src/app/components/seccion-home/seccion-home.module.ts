import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionHomeComponent } from './seccion-home.component';

@NgModule({
  imports: [CommonModule, SeccionHomeComponent],
  exports: [SeccionHomeComponent],
})
export class SeccionHomeModule {}
