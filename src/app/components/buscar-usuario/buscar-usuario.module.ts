import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarUsuarioComponent } from './buscar-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, PipesModule, BuscarUsuarioComponent],
    exports: [BuscarUsuarioComponent],
})
export class BuscarUsuarioModule {}
