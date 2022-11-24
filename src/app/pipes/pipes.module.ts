import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen/imagen.pipe';
import { VimeoUrlPipePipe } from './vimeo/vimeo-url-pipe.pipe';
import { YoutubePipe } from './youtube/youtube.pipe';

@NgModule({
  declarations: [ImagenPipe, VimeoUrlPipePipe, YoutubePipe],
  imports: [CommonModule],
  exports: [ImagenPipe, VimeoUrlPipePipe, YoutubePipe],
})
export class PipesModule {}
