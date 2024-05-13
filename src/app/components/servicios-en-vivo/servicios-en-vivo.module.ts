import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosEnVivoComponent } from './servicios-en-vivo.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [ServiciosEnVivoComponent],
  imports: [CommonModule, YouTubePlayerModule, PipesModule],
  exports: [ServiciosEnVivoComponent],
})
export class ServiciosEnVivoModule {}
