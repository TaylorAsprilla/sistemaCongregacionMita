import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibliotecaMultimediaComponent } from './biblioteca-multimedia.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [BibliotecaMultimediaComponent],
  imports: [CommonModule, YouTubePlayerModule],
  exports: [BibliotecaMultimediaComponent],
})
export class BibliotecaMultimediaModule {}
