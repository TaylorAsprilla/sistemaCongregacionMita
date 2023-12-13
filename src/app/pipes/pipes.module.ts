import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen/imagen.pipe';
import { VimeoUrlPipePipe } from './vimeo/vimeo-url-pipe.pipe';
import { YoutubePipe } from './youtube/youtube.pipe';
import { FilterByNombrePipePipe } from './FilterByNombrePipe/filter-by-nombre-pipe.pipe';

@NgModule({
  declarations: [ImagenPipe, VimeoUrlPipePipe, YoutubePipe, FilterByNombrePipePipe],
  imports: [CommonModule],
  exports: [ImagenPipe, VimeoUrlPipePipe, YoutubePipe, FilterByNombrePipePipe],
})
export class PipesModule {}
