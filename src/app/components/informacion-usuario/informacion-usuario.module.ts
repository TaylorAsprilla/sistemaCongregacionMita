import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DirectiveModule } from 'src/app/directive/directive.module';
import { InformacionUsuarioComponent } from './informacion-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
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
        InformacionUsuarioComponent,
    ],
    exports: [InformacionUsuarioComponent],
})
export class InformacionUsuarioModule {}
