import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app.routes';
import { PerfilComponent } from './perfil.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { InformacionUsuarioModule } from 'src/app/components/informacion-usuario/informacion-usuario.module';

@NgModule({
  imports: [CommonModule, AppRoutingModule, RouterModule, PipesModule, InformacionUsuarioModule, PerfilComponent],
  exports: [PerfilComponent],
})
export class PerfilModule {}
