import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ActiveSession } from 'src/app/core/interfaces/active-sessions.interface';

interface ChartData {
  name: string;
  value: number;
}

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  percentage?: number;
}

/**
 * Componente para mostrar estadísticas y gráficos de sesiones activas
 */
@Component({
  selector: 'app-sessions-statistics',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './sessions-statistics.component.html',
  styleUrls: ['./sessions-statistics.component.scss'],
})
export class SessionsStatisticsComponent implements OnChanges {
  @Input() sessions: ActiveSession[] = [];

  // Datos para gráficos
  deviceChartData: ChartData[] = [];
  countryChartData: ChartData[] = [];
  browserChartData: ChartData[] = [];
  entityChartData: ChartData[] = []; // Nuevo: Usuario vs Congregación

  // Estadísticas
  statsCards: StatCard[] = [];

  // Configuración de gráficos
  view: [number, number] = [350, 300];
  showLegend = true;
  showLabels = true;
  isDoughnut = true;
  legendPosition: any = 'below';

  // Esquema de colores
  colorScheme: any = {
    domain: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sessions'] && this.sessions) {
      this.calculateStatistics();
      this.generateChartData();
    }
  }

  /**
   * Calcula estadísticas generales
   */
  private calculateStatistics(): void {
    const total = this.sessions.length;

    // Contar usuarios únicos activos (isCurrentlyActive = true)
    const activeUsuarios = new Set(
      this.sessions.filter((s) => s.isCurrentlyActive && s.entidad.tipo === 'usuario').map((s) => s.entidad.id),
    ).size;

    // Contar congregaciones únicas activas (isCurrentlyActive = true)
    const activeCongregaciones = new Set(
      this.sessions.filter((s) => s.isCurrentlyActive && s.entidad.tipo === 'congregacion').map((s) => s.entidad.id),
    ).size;

    // Total de entidades únicas activas (usuarios + congregaciones)
    const totalActiveEntities = activeUsuarios + activeCongregaciones;

    // Contar usuarios únicos (por ID único)
    const uniqueUsuarios = new Set(this.sessions.filter((s) => s.entidad.tipo === 'usuario').map((s) => s.entidad.id))
      .size;

    // Contar congregaciones únicas (por ID único)
    const uniqueCongregaciones = new Set(
      this.sessions.filter((s) => s.entidad.tipo === 'congregacion').map((s) => s.entidad.id),
    ).size;

    // Contar por tipo de dispositivo (solo sesiones activas)
    const desktopCount = this.sessions.filter(
      (s) => s.isCurrentlyActive && s.device.tipoDispositivo === 'desktop',
    ).length;
    const mobileCount = this.sessions.filter(
      (s) => s.isCurrentlyActive && s.device.tipoDispositivo === 'mobile',
    ).length;
    const tabletCount = this.sessions.filter(
      (s) => s.isCurrentlyActive && s.device.tipoDispositivo === 'tablet',
    ).length;

    // Contar países únicos (solo sesiones activas)
    const uniqueCountries = new Set(this.sessions.filter((s) => s.isCurrentlyActive).map((s) => s.sessionLocation.pais))
      .size;

    this.statsCards = [
      {
        title: 'Total Sesiones',
        value: total,
        icon: 'fa-users',
        color: '#667eea',
      },
      {
        title: 'Activos Ahora',
        value: totalActiveEntities,
        icon: 'fa-circle',
        color: '#4ade80',
        percentage:
          uniqueUsuarios + uniqueCongregaciones > 0
            ? Math.round((totalActiveEntities / (uniqueUsuarios + uniqueCongregaciones)) * 100)
            : 0,
      },
      {
        title: 'Usuarios Activos',
        value: activeUsuarios,
        icon: 'fa-user',
        color: '#667eea',
      },
      {
        title: 'Congregaciones Activas',
        value: activeCongregaciones,
        icon: 'fa-home',
        color: '#06b6d4',
      },
      {
        title: 'Desktop Activos',
        value: desktopCount,
        icon: 'fa-desktop',
        color: '#3b82f6',
      },
      {
        title: 'Móviles Activos',
        value: mobileCount,
        icon: 'fa-mobile-alt',
        color: '#8b5cf6',
      },
      {
        title: 'Tablets Activos',
        value: tabletCount,
        icon: 'fa-tablet-alt',
        color: '#ec4899',
      },
      {
        title: 'Países Activos',
        value: uniqueCountries,
        icon: 'fa-globe',
        color: '#f59e0b',
      },
    ];
  }

  /**
   * Genera datos para los gráficos
   */
  private generateChartData(): void {
    // Gráfico por tipo de entidad (Usuario vs Congregación) - Conteo único de activos por ID
    const activeUsuarios = new Set(
      this.sessions.filter((s) => s.isCurrentlyActive && s.entidad.tipo === 'usuario').map((s) => s.entidad.id),
    ).size;

    const activeCongregaciones = new Set(
      this.sessions.filter((s) => s.isCurrentlyActive && s.entidad.tipo === 'congregacion').map((s) => s.entidad.id),
    ).size;

    this.entityChartData = [];
    if (activeUsuarios > 0) {
      this.entityChartData.push({ name: 'Usuarios Activos', value: activeUsuarios });
    }
    if (activeCongregaciones > 0) {
      this.entityChartData.push({ name: 'Congregaciones Activas', value: activeCongregaciones });
    }

    // Gráfico por tipo de dispositivo (solo sesiones activas)
    const deviceCounts = this.sessions
      .filter((s) => s.isCurrentlyActive)
      .reduce(
        (acc, session) => {
          const type = this.getDeviceTypeLabel(session.device.tipoDispositivo);
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    this.deviceChartData = Object.entries(deviceCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Gráfico por país (top 5 - solo sesiones activas)
    const countryCounts = this.sessions
      .filter((s) => s.isCurrentlyActive)
      .reduce(
        (acc, session) => {
          const country = session.sessionLocation.pais;
          if (country && country !== 'N/A') {
            acc[country] = (acc[country] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

    this.countryChartData = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Gráfico por navegador (top 5 - solo sesiones activas)
    const browserCounts = this.sessions
      .filter((s) => s.isCurrentlyActive)
      .reduce(
        (acc, session) => {
          const browser = session.device.navegador;
          if (browser) {
            acc[browser] = (acc[browser] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

    this.browserChartData = Object.entries(browserCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }

  /**
   * Obtiene la etiqueta legible del tipo de dispositivo
   */
  private getDeviceTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      desktop: 'Escritorio',
      mobile: 'Móvil',
      tablet: 'Tablet',
    };
    return labels[type] || type;
  }

  /**
   * Manejador de selección en gráficos
   */
  onSelect(event: any): void {
    // Manejar selección si es necesario
  }
}
