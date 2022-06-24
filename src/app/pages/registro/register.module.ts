import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { RegisterCampoComponent } from './register-campo/register-campo.component';
import { RegisterCongregacionComponent } from './register-congregacion/register-congregacion.component';
import { RegisterMinisterioComponent } from './register-ministerio/register-ministerio.component';

import { AppRoutingModule } from 'src/app/app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AutoCompleteComponent } from '../../components/auto-complete/auto-complete.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AutoCompleteComponent } from 'src/app/components/auto-complete/auto-complete.component';
import { SelectMultipleComponent } from 'src/app/components/select-multiple/select-multiple.component';

import { BrowserModule } from '@angular/platform-browser';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';

// import { mainModule } from 'process';

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterCampoComponent,
    RegisterCongregacionComponent,
    RegisterMinisterioComponent,
    RegistrarUsuarioComponent,
    AutoCompleteComponent,
    SelectMultipleComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    BrowserModule,
    NgMultiSelectDropDownModule,
  ],
})
export class RegisterModule {}
