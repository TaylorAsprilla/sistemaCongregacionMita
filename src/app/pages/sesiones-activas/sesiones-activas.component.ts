import { Component } from '@angular/core';
import { ActiveSessionsViewerComponent } from '../../components/active-sessions-viewer/active-sessions-viewer.component';

/**
 * Página para visualizar todas las sesiones activas del sistema
 * Solo visible para ADMINISTRADOR y ADMINISTRADOR_MULTIMEDIA
 */
@Component({
  selector: 'app-sesiones-activas',
  standalone: true,
  imports: [ActiveSessionsViewerComponent],
  templateUrl: './sesiones-activas.component.html',
  styleUrls: ['./sesiones-activas.component.scss'],
})
export class SesionesActivasComponent {}
