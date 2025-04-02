import Swal from 'sweetalert2';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ESTADO_SOLICITUD_MULTIMEDIA_ENUM } from 'src/app/core/enums/solicitudMultimendia.enum';
import { UsuarioSolicitudInterface } from 'src/app/core/interfaces/solicitud-multimedia.interface';
import { UsuarioSolicitudMultimediaModel } from 'src/app/core/models/usuario-solicitud.model';
import { ROLES, RUTAS } from 'src/app/routes/menu-items';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { TelegramPipe } from 'src/app/pipes/telegram/telegram.pipe';
import { WhatsappPipe } from 'src/app/pipes/whatsapp/whatsapp.pipe';
import { PermisosDirective } from 'src/app/directive/permisos/permisos.directive';
import { CalcularEdadPipe } from 'src/app/pipes/calcularEdad/calcular-edad.pipe';
import { ExportarExcelService } from 'src/app/services/exportar-excel/exportar-excel.service';

@Component({
  selector: 'app-solicitudes-multimedia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TelegramPipe,
    WhatsappPipe,
    PermisosDirective,
    DecimalPipe,
    CalcularEdadPipe,
  ],
  templateUrl: './solicitudes-multimedia.component.html',
  styleUrl: './solicitudes-multimedia.component.scss',
})
export class SolicitudesMultimediaComponent {
  @Input() solicitudes: UsuarioSolicitudMultimediaModel[] = [];
  @Input() usuarioId: number;

  @Input() nombreArchivo: string = '';

  @Output() onCrearAccesoMultimedia: EventEmitter<UsuarioSolicitudInterface> =
    new EventEmitter<UsuarioSolicitudInterface>();

  @Output() onDenegarAccesoMultimedia: EventEmitter<UsuarioSolicitudInterface> =
    new EventEmitter<UsuarioSolicitudInterface>();

  @Output() onEliminarSolicitudMultiemdia: EventEmitter<UsuarioSolicitudMultimediaModel> =
    new EventEmitter<UsuarioSolicitudMultimediaModel>();

  filteredSolicitudes: UsuarioSolicitudMultimediaModel[] = [];

  paises = new FormControl();
  congregaciones = new FormControl();
  campos = new FormControl();
  estados = new FormControl();
  filterForm: FormGroup;
  pagina = 1;
  pageSize = 50;

  solicitudSeleccionada: UsuarioSolicitudMultimediaModel | null = null;
  filaExpandida: number | null = null;
  selectedContact: number | null = null;

  paisesList: string[] = [];
  congregacionesList: string[] = [];
  camposList: string[] = [];
  estadosList: string[] = [];

  paisSeleccionado: string = '';
  congregacionSeleccionada: string = '';

  filterText: string = '';

  mostrarFiltros: boolean = false;

  estadoColors: { [key in ESTADO_SOLICITUD_MULTIMEDIA_ENUM]: string } = {
    [ESTADO_SOLICITUD_MULTIMEDIA_ENUM.DENEGADA]: 'badge-danger', // Color rojo
    [ESTADO_SOLICITUD_MULTIMEDIA_ENUM.APROBADA]: 'badge-success', // Color verde
    [ESTADO_SOLICITUD_MULTIMEDIA_ENUM.ELIMINADA]: 'badge-secondary', // Color gris
    [ESTADO_SOLICITUD_MULTIMEDIA_ENUM.PENDIENTE]: 'badge-warning', // Color amarillo
    [ESTADO_SOLICITUD_MULTIMEDIA_ENUM.CADUCADA]: 'badge-dark',
    [ESTADO_SOLICITUD_MULTIMEDIA_ENUM.EMAIL_NO_VERIFICADO]: 'badge-info',
  };

  get estadosSolicitud() {
    return ESTADO_SOLICITUD_MULTIMEDIA_ENUM;
  }

  get ROLES() {
    return ROLES;
  }

  constructor(
    private router: Router,
    private accesoMultimediaService: AccesoMultimediaService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private exportarExcelService: ExportarExcelService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      paises: ['', Validators.required],
      congregaciones: ['', Validators.required],
      campos: ['', Validators.required],
      estados: ['', Validators.required],
      filtroGeneral: ['', Validators.required],
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilter(); // Aplica el filtro cuando cambie cualquier campo
    });
  }

  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['solicitudes']?.currentValue) {
      this.solicitudes = this.mapSolicitudes(this.solicitudes);
      this.filteredSolicitudes = [...this.solicitudes]; // Usar una copia para evitar modificaciones accidentales
      this.transformarFiltros();
    }
  }

  mapSolicitudes(data: UsuarioSolicitudMultimediaModel[]): UsuarioSolicitudMultimediaModel[] {
    return data.map(
      (item: UsuarioSolicitudMultimediaModel) =>
        new UsuarioSolicitudMultimediaModel(
          item.id,
          item.primerNombre,
          item.segundoNombre,
          item.primerApellido,
          item.segundoApellido,
          item.numeroCelular,
          item.email,
          item.fechaNacimiento,
          item.direccion,
          item.ciudadDireccion,
          item.departamentoDireccion,
          item.paisDireccion,
          item.login,
          item.solicitudes,
          item.tipoMiembro,
          item.usuarioCongregacion
        )
    );
  }

  transformarFiltros(): void {
    const paisesSet = new Set<string>();
    const congregacionesSet = new Set<string>();
    const camposSet = new Set<string>();
    const estadosSet = new Set<string>();

    this.solicitudes.forEach((solicitud) => {
      paisesSet.add(solicitud.pais || '');
      congregacionesSet.add(solicitud.congregacion || '');
      camposSet.add(solicitud.campo || '');
      estadosSet.add(solicitud.estadoUltimaSolicitud || '');
    });

    this.paisesList = Array.from(paisesSet);
    this.congregacionesList = Array.from(congregacionesSet);
    this.camposList = Array.from(camposSet);
    this.estadosList = Array.from(estadosSet);
  }

  applyFilter(): void {
    const { paises, congregaciones, campos, estados, filtroGeneral } = this.filterForm.value;

    this.filteredSolicitudes = this.solicitudes.filter((solicitud) => {
      return (
        (paises ? solicitud.pais === paises : true) &&
        (congregaciones ? solicitud.congregacion === congregaciones : true) &&
        (campos ? solicitud.campo === campos : true) &&
        (estados ? solicitud.estadoUltimaSolicitud === estados : true) &&
        (filtroGeneral ? this.coincideFiltroGeneral(solicitud, filtroGeneral) : true)
      );
    });
  }

  coincideFiltroGeneral(solicitud: any, filtro: string): boolean {
    // Función segura para manejar strings nulos
    const getSafeString = (value: string | undefined | null): string => (value ? value.toLowerCase().trim() : '');

    const numeroMita = solicitud.id ? solicitud.id.toString() : '';
    const nombreCompleto = getSafeString(solicitud.nombreCompleto);
    const email = getSafeString(solicitud.email);
    const numeroCelular = getSafeString(solicitud.numeroCelular);

    // Dividir el filtro en palabras individuales
    const palabrasFiltro = filtro.toLowerCase().trim().split(/\s+/);

    // Verificar si todas las palabras del filtro coinciden en alguno de los campos
    return palabrasFiltro.every(
      (palabra) =>
        nombreCompleto.includes(palabra) ||
        email.includes(palabra) ||
        numeroCelular.includes(palabra) ||
        numeroMita.includes(palabra)
    );
  }

  onTableDataChange(event: any) {
    this.pagina = event;
  }

  onPaisChange(): void {
    const selectedPais = this.filterForm.get('paises')?.value;

    // Filtrar las solicitudes según el país seleccionado
    this.filteredSolicitudes = this.solicitudes.filter((solicitud) => {
      return !selectedPais || solicitud.pais === selectedPais;
    });

    // Resetear el campo 'campos' del formulario
    this.filterForm.get('campos')?.reset('');
    this.filterForm.get('congregaciones')?.reset('');

    // Actualizar las congregaciones disponibles según el país seleccionado
    this.actualizarCongregacionesDisponibles(selectedPais);

    // Si no hay congregaciones para el país, resetear el valor de 'congregaciones'
    if (!this.congregacionesList.length) {
      this.filterForm.get('congregaciones')?.setValue('');
    }

    // Aplicar el filtro de nuevo para que se actualice la vista
    this.applyFilter();
  }

  onCongregacionChange(): void {
    const selectedCongregacion = this.filterForm.get('congregaciones')?.value;

    // Actualizar la lista de campos disponibles según la congregación seleccionada
    this.actualizarCamposDisponibles(selectedCongregacion);

    // Resetear el campo 'campos' del formulario
    this.filterForm.get('campos')?.reset('');

    // Aplicar el filtro de nuevo para que se actualice la vista
    this.applyFilter();
  }
  // Método que actualiza la lista de congregaciones
  actualizarCongregacionesDisponibles(pais: string): void {
    const congregacionesSet = new Set<string>();
    this.solicitudes.forEach((solicitud) => {
      if (solicitud.pais === pais) {
        congregacionesSet.add(solicitud.congregacion || '');
      }
    });

    this.congregacionesList = [...congregacionesSet];
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  actualizarCamposDisponibles(congregacion: string): void {
    const camposSet = new Set<string>();
    this.solicitudes.forEach((solicitud) => {
      if (solicitud.congregacion === congregacion) {
        camposSet.add(solicitud.campo || '');
      }
    });

    this.camposList = [...camposSet];
    this.cdr.detectChanges();
  }

  limpiarFiltros(): void {
    // Resetear todos los campos del formulario a su valor por defecto
    this.filterForm.reset({
      paises: '',
      congregaciones: '',
      campos: '',
      estados: '',
      filtroGeneral: '',
    });

    // Aplicar el filtro sin ningún valor (esto limpiará las solicitudes filtradas)
    this.applyFilter();
  }

  crearSolicitud() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.SOLICITUD_MULTIMEDIA}/${nuevo}`);
  }

  crearAccesoMultimedia(solicitud: UsuarioSolicitudInterface) {
    this.onCrearAccesoMultimedia.emit(solicitud);
  }

  calcularFechaDeAprobacion(opcion: string): Date | null {
    const cantidad = parseInt(opcion);

    if (isNaN(cantidad) || cantidad <= 0) {
      console.error('La opción debe ser un número entero positivo.');
      return null; // Devolver nulo si la conversión no fue exitosa o si es un número inválido
    }

    const hoy = new Date();
    const fechaFutura = new Date(hoy.getTime() + cantidad * 24 * 60 * 60 * 1000); // Calcular la fecha futura en milisegundos

    return fechaFutura;
  }

  eliminarSolicitudMultimedia(solicitud: UsuarioSolicitudMultimediaModel) {
    this.onEliminarSolicitudMultiemdia.emit(solicitud);
  }

  denegarAccesoMultimedia(solicitud: UsuarioSolicitudInterface): void {
    this.onDenegarAccesoMultimedia.emit(solicitud);
  }

  toggleExpand(index: number, solicitud: UsuarioSolicitudMultimediaModel): void {
    this.solicitudSeleccionada = solicitud;
    // Si la fila ya está expandida, la colapsamos
    if (this.filaExpandida === index) {
      this.filaExpandida = null;
    } else {
      this.filaExpandida = index;
    }
  }

  handleError(error: any) {
    console.error(error);
    Swal.fire({
      title: 'Error',
      icon: 'error',
      html: `Ocurrió un error al cargar las solicitudes de acceso a CMAR LIVE. <br> ${error.error.msg}`,
    });
  }

  formatTiempoSugerido(dias: number): string {
    if (dias < 30) {
      return `${dias} días`;
    } else if (dias < 365) {
      const meses = Math.floor(dias / 30);
      return meses === 1 ? '1 Mes' : `${meses} Meses`;
    } else {
      const años = Math.floor(dias / 365);
      return años === 1 ? '1 Año' : `${años} Años`;
    }
  }

  toggleIcons(solicitud: UsuarioSolicitudInterface) {
    this.selectedContact = this.selectedContact === solicitud.id ? null : solicitud.id;
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  exportarDatosFiltrados(): void {
    const datosParaExportar = this.filteredSolicitudes.map((solicitud) => ({
      Numero_mita: solicitud.id,
      Nombre: solicitud.nombreCompleto,
      Email: solicitud.email,
      Celular: solicitud.numeroCelular,
      Congregacion: solicitud.congregacion,
      Campo: solicitud.campo,
      Estado: solicitud.estadoUltimaSolicitud,
    }));
    this.exportarExcelService.exportToExcel(datosParaExportar, this.nombreArchivo);
  }
}
