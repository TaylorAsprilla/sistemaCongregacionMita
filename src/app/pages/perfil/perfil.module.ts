import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { EditPerfilComponent } from './edit-perfil/edit-perfil.component';
import { InfoPerfilComponent } from './info-perfil/info-perfil.component';
import { PerfilComponent } from './perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [EditPerfilComponent, InfoPerfilComponent, PerfilComponent],
  imports: [CommonModule, AppRoutingModule, FormsModule, ReactiveFormsModule, RouterModule, PipesModule],
  exports: [InfoPerfilComponent, EditPerfilComponent, PerfilComponent],
})
export class PerfilModule {}
