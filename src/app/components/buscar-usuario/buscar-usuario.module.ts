import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarUsuarioComponent } from './buscar-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [BuscarUsuarioComponent],
  imports: [CommonModule, ReactiveFormsModule, PipesModule],
  exports: [BuscarUsuarioComponent],
})
export class BuscarUsuarioModule {}
