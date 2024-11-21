import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformacionUsuarioComponent } from './informacion-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    InformacionUsuarioComponent,
  ],
  exports: [InformacionUsuarioComponent],
})
export class InformacionUsuarioModule {}
