import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen/imagen.pipe';
import { VimeoUrlPipePipe } from './vimeo/vimeo-url-pipe.pipe';
import { YoutubePipe } from './youtube/youtube.pipe';
import { FilterByNombrePipePipe } from './FilterByNombrePipe/filter-by-nombre-pipe.pipe';
import { TelegramPipe } from './telegram/telegram.pipe';
import { WhatsappPipe } from './whatsapp/whatsapp.pipe';

@NgModule({
  declarations: [ImagenPipe, VimeoUrlPipePipe, YoutubePipe, FilterByNombrePipePipe, TelegramPipe, WhatsappPipe],
  imports: [CommonModule],
  exports: [ImagenPipe, VimeoUrlPipePipe, YoutubePipe, FilterByNombrePipePipe, TelegramPipe, WhatsappPipe],
  providers: [FilterByNombrePipePipe],
})
export class PipesModule {}
