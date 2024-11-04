import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DirectiveModule } from 'src/app/directive/directive.module';
import { InformacionUsuarioComponent } from './informacion-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

@NgModule({
  declarations: [InformacionUsuarioComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    DirectiveModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [InformacionUsuarioComponent],
})
export class InformacionUsuarioModule {}
