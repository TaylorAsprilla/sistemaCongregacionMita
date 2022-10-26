import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamposComponent } from './campo/campos/campos.component';
import { CongregacionesComponent } from './congregacion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from './ministerios/ministerios/ministerios.component';
import { UsuariosComponent } from './usuario/usuarios/usuarios.component';
import { CrearCongregacionComponent } from './congregacion/crear-congregacion/crear-congregacion.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearPaisComponent } from './pais/crear-pais/crear-pais.component';
import { PaisesComponent } from './pais/paises/paises.component';
import { RegistrarUsuarioComponent } from './usuario/registrar-usuario/registrar-usuario.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CrearMinisterioComponent } from './ministerios/crear-ministerio/crear-ministerio.component';
import { CargandoInformacionModule } from 'src/app/components/cargando-informacion/cargando-informacion.module';
import { ConfirmacionDeRegistroComponent } from './usuario/confirmacion-de-registro/confirmacion-de-registro.component';

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
    CrearMinisterioComponent,
    ConfirmacionDeRegistroComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    CargandoInformacionModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
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
