import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { PerfilComponent } from './perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [PerfilComponent],
  imports: [CommonModule, AppRoutingModule, FormsModule, ReactiveFormsModule, RouterModule, PipesModule],
  exports: [PerfilComponent],
})
export class PerfilModule {}
