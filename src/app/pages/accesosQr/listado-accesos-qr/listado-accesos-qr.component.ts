import Swal from 'sweetalert2';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AccesoQrInterface, AccesosQrResponseInterface } from 'src/app/core/interfaces/acceso-qr.interface';
import { QrCodeService } from 'src/app/services/qrCode/qr-code.service';
import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { PaisService } from 'src/app/services/pais/pais.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
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
  @Output() onCrearAcceso = new EventEmitter<void>();
  isFiltrosVisibles: boolean = false;
  filtrarTexto: string = '';
  accesosQrFiltrados: AccesoQrInterface[] = [];
  @Input() paises: CongregacionPaisModel[] = [];
  paisSubscription: Subscription;
  congregaciones: CongregacionModel[] = [];

  accesosQr: AccesoQrInterface[] = [];
  cargando = false;
  private accesosQrSubscription: Subscription | null = null;
  filtrarPaisTexto: string = '';
  filtrarCiudadTexto: string = '';
  pagina: number;
  totalAccesosQr: number;
  congregacionSubscription: Subscription;

  constructor(
    private router: Router,
    private qrCodeService: QrCodeService,
    private paisService: PaisService,
    private congregacionService: CongregacionService
  ) {}

  exportarDatosFiltrados() {
    throw new Error('Method not implemented.');
  }

  crearAccesoqr() {
    this.router.navigateByUrl(`/${RUTAS.SISTEMA}/${RUTAS.GENERAR_QR}`);
  }

  filtrarPais(value: any) {
    this.filtrarCiudadTexto = '';
    if (value.pais === undefined) {
      this.filtrarPaisTexto = '';
      this.congregacionesFiltradas = this.congregaciones;
    } else {
      this.originalPais = value.pais;
      this.filtrarPaisTexto = value.pais;
      this.filtrarCongregacionesPorPais(value.id);
    }
    this.accesosQrFiltrados = this.filterAccesos(this.filterText, this.filtrarPaisTexto, this.filtrarCiudadTexto);

    this.totalAccesosQr = this.accesosQrFiltrados.length;
    this.pagina = 1;
  }

  filtrarCongregacionesPorPais(pais: string) {
    this.congregacionesFiltradas = this.congregaciones?.filter(
      (congregacionBuscar) => congregacionBuscar.pais_id === parseInt(pais)
    );
  }

  originalPais: any;
  filtrarCongregacion(value: any) {
    if (value === undefined) {
      this.filtrarCiudadTexto = '';
    } else {
      this.originalCongre = value;
      this.filtrarCiudadTexto = value;
    }
    this.accesosQrFiltrados = this.filterAccesos(this.filterText, this.filtrarPaisTexto, this.filtrarCiudadTexto);
    this.totalAccesosQr = this.accesosQrFiltrados.length;
    this.pagina = 1;
  }

  filtrarCampoTexto: any;
  camposFiltrados: any;
  congregacionesFiltradas: any;
  originalCongre: any;
  filtrarCampo($event: any) {
    throw new Error('Method not implemented.');
  }

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    this.accesosQrFiltrados = this.filterAccesos(this.filterText, this.filtrarPaisTexto, this.filtrarCiudadTexto);
    // this.accesosQrFiltrados = this.filterAccesos(this.filterText, 'Puerto Rico', 'Ciales');
    console.log(this.accesosQrFiltrados);
    console.log(this.accesosQrFiltrados.length);
    this.totalAccesosQr = this.accesosQrFiltrados.length;
    this.pagina = 1;
  }

  esconderFiltros() {
    this.isFiltrosVisibles = !this.isFiltrosVisibles;
  }
  filtrarPorEdad() {
    throw new Error('Method not implemented.');
  }
  resetFiltros() {
    if (!this.accesosQr || this.accesosQr.length === 0) {
      return; // Si no hay usuarios, no realiza ninguna operación
    }

    // Reinicia los filtros a sus valores iniciales
    this.originalPais = '';
    this.originalCongre = '';
    this.filtrarPaisTexto = '';
    this.filtrarCiudadTexto = '';
    this.filtrarCampoTexto = '';
    this.filterText = '';

    // Restaura la lista completa sin cálculos adicionales
    this.accesosQrFiltrados = [...this.accesosQr];

    // Actualiza los contadores y reinicia la paginación
    this.totalAccesosQr = this.accesosQrFiltrados.length;
    this.pagina = 1;
  }

  ngOnInit(): void {
    this.obtenerAccesosQr();
    this.cargarPaises();
    this.cargarCongregaciones();
  }
  cargarCongregaciones() {
    this.cargando = true;
    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
        this.congregacionesFiltradas = congregaciones;
        this.cargando = false;
      });
  }
  cargarPaises() {
    this.cargando = true;
    this.paisSubscription = this.paisService.getPaises().subscribe((paises: CongregacionPaisModel[]) => {
      this.paises = paises;
      this.cargando = false;
    });
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
          this.accesosQrFiltrados = response.data;
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

  filterAccesos(filterTerm: string, pais: string, ciudad: string): AccesoQrInterface[] {
    const lowerFilterTerm = filterTerm.toLocaleLowerCase();
    const lowerPais = pais.toLocaleLowerCase();
    const lowerCiudad = ciudad.toLocaleLowerCase();

    if (this.accesosQr.length === 0 && lowerFilterTerm === '' && lowerPais === '' && lowerCiudad === '') {
      return this.accesosQr;
    } else {
      return this.accesosQr.filter((acceso: AccesoQrInterface) => {
        const getSafeString = (value: string | undefined | null): string => (value ? value.toLocaleLowerCase() : '');

        const nombreCompleto = getSafeString(acceso.qrAcceso?.nombre);

        const searchTerms = lowerFilterTerm.split(' ');

        const nombreCompletoMatches = searchTerms.every((term) => nombreCompleto.includes(term));

        const paisMatch = getSafeString(acceso.pais).includes(lowerPais);
        const ciudadMatch = getSafeString(acceso.ciudad).includes(lowerCiudad);
        console.log(ciudadMatch + ' ' + acceso.ciudad + ' = ' + ciudad);
        return nombreCompletoMatches && paisMatch && ciudadMatch;
      });
    }
  }
}
