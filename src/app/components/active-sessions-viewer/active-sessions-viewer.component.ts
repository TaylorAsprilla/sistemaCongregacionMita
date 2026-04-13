import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { SessionMonitorService } from 'src/app/core/services/session-monitor.service';
import { ActiveSession, ActiveSessionsResponse } from 'src/app/core/interfaces/active-sessions.interface';
import { SessionsStatisticsComponent } from '../sessions-statistics/sessions-statistics.component';

/**
 * Componente para mostrar sesiones activas en tiempo real
 *
 * Actualiza la lista cada 30 segundos automáticamente
 *
 * @example
 * <app-active-sessions-viewer></app-active-sessions-viewer>
 */
@Component({
  selector: 'app-active-sessions-viewer',
  standalone: true,
  imports: [CommonModule, SessionsStatisticsComponent],
  templateUrl: './active-sessions-viewer.component.html',
  styleUrls: ['./active-sessions-viewer.component.scss'],
})
export class ActiveSessionsViewerComponent implements OnInit, OnDestroy {
  private sessionMonitor = inject(SessionMonitorService);

  activeSessions: ActiveSession[] = [];
  sortedSessions: ActiveSession[] = [];
  totalSessions: number = 0;
  isLoading: boolean = true;
  hasError: boolean = false;

  // Sorting
  sortColumn: string = '';
  sortAscending: boolean = true;

  private updateSubscription: Subscription | null = null;
  private readonly UPDATE_INTERVAL_MS = 30 * 1000; // 30 segundos

  ngOnInit(): void {
    // Cargar datos inmediatamente
    this.loadActiveSessions();

    // Actualizar cada 30 segundos
    this.updateSubscription = interval(this.UPDATE_INTERVAL_MS)
      .pipe(
        switchMap(() => this.sessionMonitor.getActiveSessions()),
        catchError((error) => {
          console.error('Error al cargar sesiones activas:', error);
          this.hasError = true;
          this.isLoading = false;
          return [];
        }),
      )
      .subscribe({
        next: (response: ActiveSessionsResponse) => {
          this.updateSessionsData(response);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  /**
   * Carga las sesiones activas del servidor
   */
  private loadActiveSessions(): void {
    this.isLoading = true;
    this.hasError = false;

    this.sessionMonitor.getActiveSessions().subscribe({
      next: (response: ActiveSessionsResponse) => {
        this.updateSessionsData(response);
      },
      error: (error) => {
        console.error('Error al cargar sesiones activas:', error);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  /**
   * Actualiza los datos de sesiones
   */
  private updateSessionsData(response: ActiveSessionsResponse): void {
    if (response.ok) {
      this.activeSessions = response.sessions;
      this.sortedSessions = [...response.sessions];
      this.totalSessions = response.totalActiveSessions;
      this.isLoading = false;
      this.hasError = false;

      // Reaplica el ordenamiento si existe
      if (this.sortColumn) {
        this.applySorting();
      }
    }
  }

  /**
   * Ordena la tabla por columna
   */
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.applySorting();
  }

  /**
   * Aplica el ordenamiento
   */
  private applySorting(): void {
    this.sortedSessions = [...this.activeSessions].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case 'usuario':
          valueA = a.user.nombreCompleto.toLowerCase();
          valueB = b.user.nombreCompleto.toLowerCase();
          break;
        case 'congregacion':
          valueA = `${a.congregacion.pais} ${a.congregacion.ciudad}`.toLowerCase();
          valueB = `${b.congregacion.pais} ${b.congregacion.ciudad}`.toLowerCase();
          break;
        case 'ubicacion':
          valueA = `${a.sessionLocation.ciudad} ${a.sessionLocation.pais}`.toLowerCase();
          valueB = `${b.sessionLocation.ciudad} ${b.sessionLocation.pais}`.toLowerCase();
          break;
        case 'dispositivo':
          valueA = `${a.device.navegador} ${a.device.so}`.toLowerCase();
          valueB = `${b.device.navegador} ${b.device.so}`.toLowerCase();
          break;
        case 'actividad':
          valueA = new Date(a.timestamps.lastActivityAt).getTime();
          valueB = new Date(b.timestamps.lastActivityAt).getTime();
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.sortAscending ? -1 : 1;
      if (valueA > valueB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  /**
   * Obtiene el ícono de ordenamiento
   */
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fas fa-sort';
    }
    return this.sortAscending ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  /**
   * Obtiene el icono según el tipo de dispositivo
   */
  getDeviceIcon(tipoDispositivo: string): string {
    switch (tipoDispositivo) {
      case 'desktop':
        return 'fa-desktop';
      case 'mobile':
        return 'fa-mobile-alt';
      case 'tablet':
        return 'fa-tablet-alt';
      default:
        return 'fa-laptop';
    }
  }

  /**
   * Formatea la fecha de actividad para mostrarla de forma amigable
   */
  getTimeAgo(timestamp: string): string {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return 'Hace más de 1 día';
  }

  /**
   * Obtiene el color del badge según el tiempo de actividad
   */
  getActivityBadgeClass(timestamp: string): string {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 5) return 'badge-success'; // Verde - muy reciente
    if (minutes < 15) return 'badge-info'; // Azul - reciente
    if (minutes < 30) return 'badge-warning'; // Amarillo - hace rato
    return 'badge-secondary'; // Gris - inactivo
  }

  /**
   * Obtiene la clase de estado según la actividad
   */
  getStatusClass(timestamp: string): string {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 5) return 'status-active';
    if (minutes < 15) return 'status-idle';
    return 'status-inactive';
  }
}
