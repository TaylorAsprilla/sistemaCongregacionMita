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

    // Contar sesiones actualmente activas usando el campo del backend
    const activeNow = this.sessions.filter((s) => s.isCurrentlyActive).length;

    // Contar por tipo de entidad
    const usuariosCount = this.sessions.filter((s) => s.entidad.tipo === 'usuario').length;
    const congregacionesCount = this.sessions.filter((s) => s.entidad.tipo === 'congregacion').length;

    // Contar por tipo de dispositivo
    const desktopCount = this.sessions.filter((s) => s.device.tipoDispositivo === 'desktop').length;
    const mobileCount = this.sessions.filter((s) => s.device.tipoDispositivo === 'mobile').length;
    const tabletCount = this.sessions.filter((s) => s.device.tipoDispositivo === 'tablet').length;

    // Contar países únicos
    const uniqueCountries = new Set(this.sessions.map((s) => s.sessionLocation.pais)).size;

    this.statsCards = [
      {
        title: 'Total Sesiones',
        value: total,
        icon: 'fa-users',
        color: '#667eea',
      },
      {
        title: 'Activos Ahora',
        value: activeNow,
        icon: 'fa-circle',
        color: '#4ade80',
        percentage: total > 0 ? Math.round((activeNow / total) * 100) : 0,
      },
      {
        title: 'Usuarios',
        value: usuariosCount,
        icon: 'fa-user',
        color: '#667eea',
      },
      {
        title: 'Congregaciones',
        value: congregacionesCount,
        icon: 'fa-home',
        color: '#06b6d4',
      },
      {
        title: 'Desktop',
        value: desktopCount,
        icon: 'fa-desktop',
        color: '#3b82f6',
      },
      {
        title: 'Móviles',
        value: mobileCount,
        icon: 'fa-mobile-alt',
        color: '#8b5cf6',
      },
      {
        title: 'Tablets',
        value: tabletCount,
        icon: 'fa-tablet-alt',
        color: '#ec4899',
      },
      {
        title: 'Países',
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
    // Gráfico por tipo de entidad (Usuario vs Congregación)
    const entityCounts = this.sessions.reduce(
      (acc, session) => {
        const type = session.entidad.tipo === 'usuario' ? 'Usuarios' : 'Congregaciones';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    this.entityChartData = Object.entries(entityCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Gráfico por tipo de dispositivo
    const deviceCounts = this.sessions.reduce(
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

    // Gráfico por país (top 5)
    const countryCounts = this.sessions.reduce(
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

    // Gráfico por navegador (top 5)
    const browserCounts = this.sessions.reduce(
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
