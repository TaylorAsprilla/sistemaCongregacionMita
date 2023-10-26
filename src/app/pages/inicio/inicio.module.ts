import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DirectiveModule } from 'src/app/directive/directive.module';
import { SeccionHomeModule } from 'src/app/components/seccion-home/seccion-home.module';
import { BibliotecaMultimediaModule } from 'src/app/components/biblioteca-multimedia/biblioteca-multimedia.module';

@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppRoutingModule,
    DirectiveModule,
    BibliotecaMultimediaModule,
    SeccionHomeModule,
  ],
  exports: [InicioComponent],
})
export class InicioModule {}
