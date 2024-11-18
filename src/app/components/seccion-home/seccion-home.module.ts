import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SeccionHomeComponent } from './seccion-home.component';
import { DirectiveModule } from 'src/app/directive/directive.module';

@NgModule({
    imports: [CommonModule, AppRoutingModule, DirectiveModule, SeccionHomeComponent],
    exports: [SeccionHomeComponent],
})
export class SeccionHomeModule {}
