import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LinkEventoModel, PLATAFORMA, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { NgIf } from '@angular/common';
import { YouTubePlayer } from '@angular/youtube-player';
import { YoutubePipe } from '../../pipes/youtube/youtube.pipe';

@Component({
    selector: 'app-servicios-en-vivo',
    templateUrl: './servicios-en-vivo.component.html',
    styleUrls: ['./servicios-en-vivo.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        YouTubePlayer,
        YoutubePipe,
    ],
})
export class ServiciosEnVivoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() servicios: LinkEventoModel = null;
  @Input() tipoDeEvento: TIPOEVENTO_ID | string;

  @ViewChild('templateYouTubePlayer') templateYouTubePlayer: ElementRef<HTMLDivElement>;
  videoWidth: number | undefined;
  videoHeight: number | undefined;

  videoUrl: SafeResourceUrl | undefined;
  servicioPlataforma: string = '';
  titulo: string = '';

  readonly PLATAFORMA = PLATAFORMA;
  readonly TIPOEVENTO_ID = TIPOEVENTO_ID;

  constructor(private changeDetectorRef: ChangeDetectorRef, public domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicios'] && changes['servicios'].currentValue) {
      const videos = changes['servicios'].currentValue as LinkEventoModel;
      if (videos.plataforma === PLATAFORMA.VIMEO) {
        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(videos.link);
      } else {
        this.videoUrl = videos.link;
      }
      this.servicioPlataforma = videos.plataforma;
      this.titulo = videos.titulo;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  ngAfterViewInit(): void {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  onResize = (): void => {
    // Automatically expand the video to fit the page up to 1200px x 720px
    this.videoWidth = Math.min(this.templateYouTubePlayer?.nativeElement.clientWidth, 1000);
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  };
}
