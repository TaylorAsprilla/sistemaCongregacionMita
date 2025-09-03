import Swal from 'sweetalert2';
import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AccesoQrInterface, AccesosQrResponseInterface } from 'src/app/core/interfaces/acceso-qr.interface';
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

  paises: string[] = [];
  ciudades: string[] = [];
  accesosQr: AccesoQrInterface[] = [];
  accesosQrFiltrados: AccesoQrInterface[] = [];

  isFiltrosVisibles: boolean = false;
  filtrarTexto: string = '';

  fechaInicio: string = '';
  fechaFin: string = '';

  cargando = false;
  filtrarPaisTexto: string = '';
  filtrarCiudadTexto: string = '';

  originalPais: string;
  originalCiudad: string;

  totalAccesosQr: number;

  private accesosQrSubscription: Subscription | null = null;

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    this.accesosQrFiltrados = this.filterAccesos(this.filterText, this.filtrarPaisTexto, this.filtrarCiudadTexto);

    this.totalAccesosQr = this.accesosQrFiltrados.length;
  }

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
    this.accesosQrSubscription = this.qrCodeService.obtenerListadoAccesos().subscribe({
      next: (response: AccesosQrResponseInterface) => {
        this.cargando = false;

        if (response.ok) {
          this.accesosQr = response.data;
          this.accesosQrFiltrados = response.data;

          this.paises = Array.from(new Set(this.accesosQr.map((acceso) => acceso.pais)));
          this.ciudades = Array.from(new Set(this.accesosQr.map((acceso) => acceso.ciudad)));
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

  filtrarPais(pais: string): void {
    this.filtrarPaisTexto = pais;
    this.filtrarCiudadTexto = '';
    this.originalCiudad = '';

    this.accesosQrFiltrados = this.filterAccesos(this.filterText, this.filtrarPaisTexto, this.filtrarCiudadTexto);

    this.totalAccesosQr = this.accesosQrFiltrados.length;
  }

  filtrarCiudad(ciudad: string): void {
    this.filtrarCiudadTexto = ciudad;
    this.filtrarPaisTexto = '';
    this.originalPais = '';

    this.accesosQrFiltrados = this.filterAccesos(this.filterText, this.filtrarPaisTexto, this.filtrarCiudadTexto);

    this.totalAccesosQr = this.accesosQrFiltrados.length;
  }

  filtrarPorRangoFechas() {
    const inicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
    const fin = this.fechaFin ? new Date(this.fechaFin) : null;

    this.accesosQrFiltrados = this.accesosQr.filter((acceso) => {
      const fechaAcceso = new Date(acceso.createdAt);
      if (inicio && fechaAcceso < inicio) return false;
      if (fin && fechaAcceso > fin) return false;
      return true;
    });
  }

  esconderFiltros() {
    this.isFiltrosVisibles = !this.isFiltrosVisibles;
  }

  resetFiltros() {
    if (!this.accesosQr || this.accesosQr.length === 0) {
      return; // Si no hay usuarios, no realiza ninguna operación
    }

    // Reinicia los filtros a sus valores iniciales

    this.filtrarPaisTexto = '';
    this.filtrarCiudadTexto = '';

    this.filterText = '';
    this.fechaInicio = '';
    this.fechaFin = '';

    // Restaura la lista completa sin cálculos adicionales
    this.accesosQrFiltrados = [...this.accesosQr];

    // Actualiza los contadores
    this.totalAccesosQr = this.accesosQrFiltrados.length;
  }

  mostrarError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#2563eb',
    });
  }

  filterAccesos(filterTerm: string, pais: string, ciudad: string): AccesoQrInterface[] {
    const lowerFilterTerm = filterTerm.toLocaleLowerCase() || '';
    const lowerPais = pais.toLocaleLowerCase() || '';
    const lowerCiudad = ciudad.toLocaleLowerCase() || '';

    if (this.accesosQr.length === 0 && lowerFilterTerm === '' && lowerPais === '' && lowerCiudad === '') {
      return this.accesosQr;
    } else {
      return this.accesosQr.filter((acceso: AccesoQrInterface) => {
        const getSafeString = (value: string | undefined | null): string => (value ? value.toLocaleLowerCase() : '');

        const nombreCompleto = getSafeString(acceso.qrAcceso?.nombre);
        const searchTerms = lowerFilterTerm.split(' ');
        const nombreCompletoMatches = searchTerms.every((term) => nombreCompleto.includes(term));

        // Cambia includes por igualdad exacta o vacío (sin filtro)
        const paisMatch = lowerPais === '' || getSafeString(acceso.pais) === lowerPais;
        const ciudadMatch = lowerCiudad === '' || getSafeString(acceso.ciudad).includes(lowerCiudad);

        return nombreCompletoMatches && paisMatch && ciudadMatch;
      });
    }
  }
}
