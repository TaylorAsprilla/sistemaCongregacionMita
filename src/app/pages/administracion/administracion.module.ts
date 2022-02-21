import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamposComponent } from './campos/campos.component';
import { CongregacionesComponent } from './congregaciones/congregaciones.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MinisteriosComponent } from './ministerios/ministerios.component';

@NgModule({
  declarations: [CamposComponent, CongregacionesComponent, MinisteriosComponent, UsuariosComponent],
  imports: [CommonModule],
  exports: [CamposComponent, CongregacionesComponent, MinisteriosComponent, UsuariosComponent],
})
export class AdministracionModule {}
