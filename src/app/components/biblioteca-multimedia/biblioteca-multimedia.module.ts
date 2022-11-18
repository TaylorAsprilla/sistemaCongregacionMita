import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibliotecaMultimediaComponent } from './biblioteca-multimedia.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [BibliotecaMultimediaComponent],
  imports: [CommonModule, YouTubePlayerModule, PipesModule],
  exports: [BibliotecaMultimediaComponent],
})
export class BibliotecaMultimediaModule {}
