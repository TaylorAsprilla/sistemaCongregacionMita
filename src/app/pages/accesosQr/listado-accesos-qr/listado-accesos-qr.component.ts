import Swal from 'sweetalert2';
import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import {
  AccesoQrInterface,
  AccesosQrResponseInterface,
  PaginationMetadata,
} from 'src/app/core/interfaces/acceso-qr.interface';
import { QrCodeService } from 'src/app/services/qrCode/qr-code.service';
import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-listado-accesos-qr',
  standalone: true,
  imports: [CargandoInformacionComponent, CommonModule, FormsModule],
  templateUrl: './listado-accesos-qr.component.html',
  styleUrl: './listado-accesos-qr.component.scss',
})
export default class ListadoAccesosQRComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private qrCodeService = inject(QrCodeService);

  @Output() crearAcceso = new EventEmitter<void>();

  // Exponer Math para el template
  Math = Math;

  accesosQr: AccesoQrInterface[] = [];
  cargando = false;

  // Propiedades de paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pagination: PaginationMetadata | null = null;

  private accesosQrSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.obtenerAccesosQr();
  }

  ngOnDestroy(): void {
    this.accesosQrSubscription?.unsubscribe();
  }

  crearAccesoqr() {
    this.router.navigateByUrl(`/${RUTAS.SISTEMA}/${RUTAS.GENERAR_QR}`);
  }

  obtenerAccesosQr(): void {
    this.cargando = true;

    this.accesosQrSubscription = this.qrCodeService
      .obtenerListadoAccesos(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: AccesosQrResponseInterface) => {
          this.cargando = false;

          if (response.ok) {
            this.accesosQr = response.data;
            this.pagination = response.pagination || null;
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

  // Métodos de paginación
  goToPage(page: number): void {
    if (page < 1 || (this.pagination && page > this.pagination.totalPages)) {
      return;
    }
    this.currentPage = page;
    this.obtenerAccesosQr();
  }

  nextPage(): void {
    if (this.pagination?.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.pagination?.hasPrevPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  changeItemsPerPage(limit: number): void {
    this.itemsPerPage = limit;
    this.currentPage = 1;
    this.obtenerAccesosQr();
  }

  get pageNumbers(): number[] {
    if (!this.pagination) return [];
    const total = this.pagination.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    // Mostrar un rango de páginas alrededor de la página actual
    const range = 2;
    for (let i = Math.max(1, current - range); i <= Math.min(total, current + range); i++) {
      pages.push(i);
    }
    return pages;
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
