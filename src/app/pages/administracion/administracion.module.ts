import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamposComponent } from './campo/campos/campos.component';
import { CongregacionesComponent } from './congregacion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from './ministerios/ministerios.component';
import { UsuariosComponent } from './usuario/usuarios/usuarios.component';
import { CrearCongregacionComponent } from './congregacion/crear-congregacion/crear-congregacion.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearPaisComponent } from './pais/crear-pais/crear-pais.component';
import { PaisesComponent } from './pais/paises/paises.component';
import { RegistrarUsuarioComponent } from './usuario/registrar-usuario/registrar-usuario.component';

@NgModule({
  declarations: [
    CamposComponent,
    CongregacionesComponent,
    CrearPaisComponent,
    MinisteriosComponent,
    UsuariosComponent,
    CrearCongregacionComponent,
    PaisesComponent,
    RegistrarUsuarioComponent,
  ],
  imports: [CommonModule, ComponentsModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  exports: [
    CamposComponent,
    CongregacionesComponent,
    MinisteriosComponent,
    UsuariosComponent,
    CrearCongregacionComponent,
    CrearPaisComponent,
    RegistrarUsuarioComponent,
  ],
})
export class AdministracionModule {}
