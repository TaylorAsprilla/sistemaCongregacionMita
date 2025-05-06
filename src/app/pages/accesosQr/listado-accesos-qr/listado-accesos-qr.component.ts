import Swal from 'sweetalert2';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccesoQrInterface, AccesosQrResponseInterface } from 'src/app/core/interfaces/acceso-qr.interface';
import { QrCodeService } from 'src/app/services/qrCode/qr-code.service';
import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listado-accesos-qr',
  standalone: true,
  imports: [CargandoInformacionComponent, CommonModule],
  templateUrl: './listado-accesos-qr.component.html',
  styleUrl: './listado-accesos-qr.component.scss',
})
export default class ListadoAccesosQRComponent implements OnInit, OnDestroy {
  accesosQr: AccesoQrInterface[] = [];
  cargando = false;
  private accesosQrSubscription: Subscription | null = null;

  constructor(private qrCodeService: QrCodeService) {}

  ngOnInit(): void {
    this.obtenerAccesosQr();
  }

  ngOnDestroy(): void {
    this.accesosQrSubscription?.unsubscribe();
  }

  obtenerAccesosQr(): void {
    this.cargando = true;
    this.accesosQrSubscription = this.qrCodeService.obtenerListadoAccesos().subscribe({
      next: (response: AccesosQrResponseInterface) => {
        this.cargando = false;

        if (response.ok) {
          this.accesosQr = response.data;
        } else {
          this.mostrarError('No se pudo cargar la información de accesos.');
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mostrarError('Ocurrió un error al obtener los accesos.');
        console.error(err);
      },
    });
  }

  mostrarError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#2563eb',
    });
  }
}
