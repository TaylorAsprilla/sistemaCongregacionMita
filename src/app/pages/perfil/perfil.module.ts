import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { EditPerfilComponent } from './edit-perfil/edit-perfil.component';
import { InfoPerfilComponent } from './info-perfil/info-perfil.component';
import { PerfilComponent } from './perfil.component';

@NgModule({
  declarations: [
 EditPerfilComponent,
 InfoPerfilComponent,
 PerfilComponent
  ],
  imports: [CommonModule, AppRoutingModule],
  exports: [InfoPerfilComponent, EditPerfilComponent, PerfilComponent]
})
export class PerfilModule {}
