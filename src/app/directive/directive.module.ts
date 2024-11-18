import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisosDirective } from './permisos/permisos.directive';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [CommonModule, BrowserModule, AppRoutingModule, PermisosDirective],
    exports: [PermisosDirective],
})
export class DirectiveModule {}
