import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LinkEventoModel } from 'src/app/core/models/link-evento.model';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimiza la detección de cambios
})
export class ServiciosComponent implements OnInit, OnDestroy {
  videos: LinkEventoModel[] = [];
  visibleVideos: LinkEventoModel[] = [];
  searchTitle: string = '';
  searchService: string = '';
  searchDate: string = '';
  loading: boolean = true;
  selectedVideoLink: SafeResourceUrl | null = null;

  videosSubscription: Subscription | null = null;

  // Paginación
  pageSize = 6; // Número de videos por página
  currentPage = 0;

  constructor(
    private linkEventosService: LinkEventosService,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.videosSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.loading = true;
    this.videosSubscription = this.linkEventosService.getEventos().subscribe({
      next: (eventos: LinkEventoModel[]) => {
        this.videos = eventos.filter((evento) => evento.estado === true && evento.eventoEnBiblioteca === true);
        this.applyFilters(); // Aplicar filtros iniciales
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.loading = false;
      },
    });
  }

  // Método para aplicar los filtros
  applyFilters(): void {
    this.currentPage = 0;
    this.visibleVideos = [];
    const filtered = this.videos.filter((video) => {
      const matchesTitle = video.titulo.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesService = this.searchService ? video.titulo.includes(this.searchService) : true;
      const matchesDate = this.searchDate
        ? new Date(video.fecha).toISOString().split('T')[0] === this.searchDate
        : true;

      return matchesTitle && matchesService && matchesDate;
    });
    this.visibleVideos = filtered.slice(0, this.pageSize);
    this.currentPage++;
  }

  // Cargar más videos
  loadMore(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newVideos = this.videos.slice(startIndex, endIndex);
    this.visibleVideos = this.visibleVideos.concat(newVideos);
    this.currentPage++;
  }

  // Verificar si hay más videos para cargar
  get hasMoreVideos(): boolean {
    return this.visibleVideos.length < this.videos.length;
  }

  // Extraer el ID de YouTube
  getYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:live\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }

  // Extraer el ID de Vimeo
  getVimeoId(url: string): string | null {
    const regex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }

  // Obtener la URL de embed segura
  getSafeEmbedUrl(url: string): SafeResourceUrl | null {
    let embedUrl: string | null = null;

    // Verificar si es YouTube
    const youtubeId = this.getYouTubeId(url);
    if (youtubeId) {
      embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
    }

    // Verificar si es Vimeo
    const vimeoId = this.getVimeoId(url);
    if (vimeoId) {
      embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
    }

    // Marcar la URL como segura
    return embedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl) : null;
  }
}
