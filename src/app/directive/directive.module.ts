import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisosDirective } from './permisos/permisos.directive';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [PermisosDirective],
  imports: [CommonModule, BrowserModule, AppRoutingModule],
  exports: [PermisosDirective],
})
export class DirectiveModule {}
