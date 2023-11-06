import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { PerfilComponent } from './perfil.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { InformacionUsuarioModule } from 'src/app/components/informacion-usuario/informacion-usuario.module';

@NgModule({
  declarations: [PerfilComponent],
  imports: [CommonModule, AppRoutingModule, RouterModule, PipesModule, InformacionUsuarioModule],
  exports: [PerfilComponent],
})
export class PerfilModule {}
