import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibliotecaMultimediaComponent } from './biblioteca-multimedia.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [BibliotecaMultimediaComponent],
  imports: [CommonModule, PipesModule, YouTubePlayerModule],
  exports: [BibliotecaMultimediaComponent],
})
export class BibliotecaMultimediaModule {}
