import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { generarSeccioninforme, Seccion } from 'src/app/core/interfaces/seccion-informe.interface';
import { InformeModel } from 'src/app/core/models/informe.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

import { SeccionInformeComponent } from '../../../components/seccion-informe/seccion-informe.component';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss'],
  standalone: true,
  imports: [SeccionInformeComponent],
})
export class InformeComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);

  informes: InformeModel[] = [];
  generarSeccioninforme: Seccion[] = generarSeccioninforme;

  diasFinTrimestre: number;
  hayInformeAbierto: boolean = false;

  currYear = new Date().getFullYear();

  trimestreActual = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  finPrimerTrimestre = new Date('april 1, ' + this.currYear + ' 00:00:00').getTime();
  finSegundoTrimestre = new Date('july 1, ' + this.currYear + ' 00:00:00').getTime();
  finTercerTrimestre = new Date('october 1, ' + this.currYear + ' 00:00:00').getTime();
  finCuartoTrimestre = new Date('january 1, ' + (this.currYear + 1) + ' 00:00:00').getTime();

  trimestres = [this.finPrimerTrimestre, this.finSegundoTrimestre, this.finTercerTrimestre, this.finCuartoTrimestre];

  get Rutas() {
    return RUTAS;
  }

  ngOnInit(): void {
    this.diasFinTrimestre = this.calcularDiasFinTrimestre();
    this.verificarInformeAbierto();
    console.log('Trimestre actual:', this.getTrimestresActual());
    console.log('Días para fin de trimestre:', this.diasFinTrimestre);
  }

  /**
   * Retorna el número del trimestre actual (1, 2, 3 o 4)
   * basándose en el mes actual
   */
  getTrimestresActual(): number {
    const mesActual = new Date().getMonth(); // 0-11 (0=Enero, 11=Diciembre)
    return Math.floor(mesActual / 3) + 1;
  }

  /**
   * Verifica si existe un informe abierto para el trimestre actual
   */
  verificarInformeAbierto(): void {
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    const usuarioId = this.usuarioService.usuarioId;

    // Usar cargarInformeActivo para guardar el informe en el servicio
    this.informeService.cargarInformeActivo(usuarioId, fechaInicio, fechaFin).subscribe(
      (respuesta) => {
        console.log('Respuesta de verificación de informe abierto:', respuesta);
        this.hayInformeAbierto = respuesta.tieneInformeAbierto;
        console.log('Hay informe abierto:', this.hayInformeAbierto);
        console.log('ID del informe activo:', this.informeService.informeActivoId);
      },
      (error) => {
        console.error('Error al verificar informe abierto:', error);
        this.hayInformeAbierto = false;
      },
    );
  }

  /**
   * Calcula cuántos días faltan para el fin del trimestre actual
   */
  calcularDiasFinTrimestre(): number {
    const ahora = new Date().getTime();
    const trimestreActual = this.getTrimestresActual();

    // Obtener la fecha de fin del trimestre actual
    const fechaFinTrimestre = this.trimestres[trimestreActual - 1];

    // Calcular la diferencia en milisegundos
    const diferencia = fechaFinTrimestre - ahora;

    // Convertir a días
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    return dias;
  }

  /**
   * Obtiene las fechas de inicio y fin del trimestre actual
   */
  obtenerFechasTrimestreActual(): { fechaInicio: string; fechaFin: string } {
    const hoy = new Date();
    const mes = hoy.getMonth(); // 0-11
    const anio = hoy.getFullYear();
    const trimestre = Math.floor(mes / 3) + 1;

    let fechaInicio: Date;
    let fechaFin: Date;

    switch (trimestre) {
      case 1: // Enero - Marzo
        fechaInicio = new Date(anio, 0, 1);
        fechaFin = new Date(anio, 2, 31);
        break;
      case 2: // Abril - Junio
        fechaInicio = new Date(anio, 3, 1);
        fechaFin = new Date(anio, 5, 30);
        break;
      case 3: // Julio - Septiembre
        fechaInicio = new Date(anio, 6, 1);
        fechaFin = new Date(anio, 8, 30);
        break;
      case 4: // Octubre - Diciembre
        fechaInicio = new Date(anio, 9, 1);
        fechaFin = new Date(anio, 11, 31);
        break;
    }

    return {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    };
  }

  /**
   * Verifica si existe un informe abierto para el trimestre actual
   * antes de permitir generar un nuevo informe
   */
  generarInforme() {
    const { fechaInicio, fechaFin } = this.obtenerFechasTrimestreActual();
    const usuarioId = this.usuarioService.usuarioId;

    this.informeService.verificarInformeAbierto(usuarioId, fechaInicio, fechaFin).subscribe(
      (respuesta) => {
        if (respuesta.tieneInformeAbierto) {
          // Ya existe un informe abierto
          Swal.fire({
            title: 'Informe ya existe',
            text: `Ya existe un informe abierto para el ${this.getTrimestresActual()}${this.getTrimestresActual() === 1 ? 'er' : this.getTrimestresActual() === 3 ? 'er' : 'do'} trimestre.`,
            icon: 'info',
            confirmButtonText: 'Entendido',
          });
        } else {
          // No existe informe, mostrar confirmación para crear uno nuevo
          Swal.fire({
            title: 'Generar Informe',
            text: `¿Desea generar un nuevo informe para el ${this.getTrimestresActual()}${this.getTrimestresActual() === 1 ? 'er' : this.getTrimestresActual() === 3 ? 'er' : 'do'} trimestre?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, generar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.crearNuevoInforme(fechaInicio, fechaFin);
            }
          });
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo verificar el estado del informe. Intente nuevamente.',
          icon: 'error',
        });
      },
    );
  }

  /**
   * Crea un nuevo informe para el trimestre actual
   */
  private crearNuevoInforme(fechaInicio: string, fechaFin: string) {
    const nuevoInforme = {
      usuario_id: this.usuarioService.usuarioId,
    };

    this.informeService.crearInforme(nuevoInforme).subscribe(
      (respuesta: any) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El informe se ha generado correctamente.',
          icon: 'success',
        });
        // Volver a verificar si el informe está abierto y actualizar la vista
        this.verificarInformeAbierto();
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo generar el informe. Intente nuevamente.',
          icon: 'error',
        });
      },
    );
  }
}
