import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarUsuarioComponent } from './buscar-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BuscarUsuarioComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [BuscarUsuarioComponent],
})
export class BuscarUsuarioModule {}
