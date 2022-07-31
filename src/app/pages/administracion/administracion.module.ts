import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamposComponent } from './campos/campos.component';
import { CongregacionesComponent } from './congregacion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from './ministerios/ministerios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearCongregacionComponent } from './congregacion/crear-congregacion/crear-congregacion.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearPaisComponent } from './pais/crear-pais/crear-pais.component';
import { PaisesComponent } from './pais/paises/paises.component';

@NgModule({
  declarations: [
    CamposComponent,
    CongregacionesComponent,
    CrearPaisComponent,
    MinisteriosComponent,
    UsuariosComponent,
    CrearCongregacionComponent,
    PaisesComponent,
  ],
  imports: [CommonModule, ComponentsModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  exports: [
    CamposComponent,
    CongregacionesComponent,
    MinisteriosComponent,
    UsuariosComponent,
    CrearCongregacionComponent,
    CrearPaisComponent,
  ],
})
export class AdministracionModule {}
