import { Component, OnDestroy, OnInit } from '@angular/core';
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
})
export class ServiciosComponent implements OnInit, OnDestroy {
  videos: LinkEventoModel[] = [];
  visibleVideos: LinkEventoModel[] = [];
  searchTitle: string = '';
  searchService: string = '';
  searchDate: string = '';
  loading: boolean = true;
  selectedVideoLink: SafeResourceUrl | null = null;

  // Paginación
  pageSize = 6; // Número de videos por página
  currentPage = 0;

  private linkEventosSubscription!: Subscription;

  constructor(private linkEventosService: LinkEventosService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  ngOnDestroy(): void {
    this.linkEventosSubscription?.unsubscribe();
  }

  cargarEventos(): void {
    this.loading = true;
    this.linkEventosSubscription = this.linkEventosService.getEventos().subscribe({
      next: (eventos: LinkEventoModel[]) => {
        this.videos = eventos.map((video) => ({ ...video, isVisible: false }));
        this.loadMore(); // Cargar la primera página
        this.loading = false;
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

  // Obtener la URL segura para iframes
  getSafeUrl(url: string): SafeResourceUrl {
    let safeUrl = url;

    // Extraer el ID de YouTube si la URL es de YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.getYouTubeId(url);

      if (videoId) {
        safeUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Asegurarse de que la URL de Vimeo sea de embed
    if (url.includes('vimeo.com') && !url.includes('/embed/')) {
      const parts = url.split('/');
      const eventId = parts[parts.length - 2];
      const hash = parts[parts.length - 1];
      safeUrl = `https://vimeo.com/event/${eventId}/embed/${hash}`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
  }

  // Obtener la miniatura del video
  getThumbnailUrl(url: string): string {
    return `assets/images/miniatura-video.jpg`; // Miniatura de YouTube
  }

  // Extraer el ID de YouTube de una URL
  getYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:live\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }

  // Reproducir video en modal
  playVideo(link: string): void {
    this.selectedVideoLink = this.getSafeUrl(link);
  }

  // Cerrar reproductor de video
  closePlayer(): void {
    this.selectedVideoLink = null;
  }

  // Optimizar el rendimiento del DOM
  trackByVideoId(index: number, video: LinkEventoModel): number {
    return video.id;
  }
}
