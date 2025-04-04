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

@Component({
  selector: 'app-servicios-en-vivo',
  templateUrl: './servicios-en-vivo.component.html',
  styleUrls: ['./servicios-en-vivo.component.scss'],
  standalone: true,
  imports: [],
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
      } else if (videos.plataforma === PLATAFORMA.YOUTUBE) {
        const videoId = this.extractYouTubeVideoId(videos.link);

        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?autoplay=1`
        );
      } else {
        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(videos.link);
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

  extractYouTubeVideoId(url: string): string {
    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : '';
  }

  onResize = (): void => {
    // Automatically expand the video to fit the page up to 1200px x 720px
    this.videoWidth = Math.min(this.templateYouTubePlayer?.nativeElement.clientWidth, 1000);
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  };
}
