import Swal from 'sweetalert2';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ESTADO_SOLICITUD_MULTIMEDIA_ENUM } from 'src/app/core/enums/solicitudMultimendia.enum';
import { UsuarioSolicitudInterface } from 'src/app/core/interfaces/solicitud-multimedia.interface';
import { UsuarioSolicitudMultimediaModel } from 'src/app/core/models/usuario-solicitud.model';
import { ROLES, RUTAS } from 'src/app/routes/menu-items';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { TelegramPipe } from 'src/app/pipes/telegram/telegram.pipe';
import { WhatsappPipe } from 'src/app/pipes/whatsapp/whatsapp.pipe';
import { PermisosDirective } from 'src/app/directive/permisos/permisos.directive';

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
  ],
  templateUrl: './solicitudes-multimedia.component.html',
  styleUrl: './solicitudes-multimedia.component.scss',
})
export class SolicitudesMultimediaComponent {
  @Input() solicitudes: UsuarioSolicitudMultimediaModel[] = [];
  @Input() usuarioId: number;

  @Output() onCrearAccesoMultimedia: EventEmitter<UsuarioSolicitudInterface> =
    new EventEmitter<UsuarioSolicitudInterface>();

  @Output() onDenegarAccesoMultimedia: EventEmitter<UsuarioSolicitudInterface> =
    new EventEmitter<UsuarioSolicitudInterface>();

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
    private cdr: ChangeDetectorRef
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

    const nombreCompleto = getSafeString(solicitud.nombreCompleto);
    const email = getSafeString(solicitud.email);
    const numeroCelular = getSafeString(solicitud.numeroCelular);

    // Dividir el filtro en palabras individuales
    const palabrasFiltro = filtro.toLowerCase().trim().split(/\s+/);

    // Verificar si todas las palabras del filtro coinciden en alguno de los campos
    return palabrasFiltro.every(
      (palabra) => nombreCompleto.includes(palabra) || email.includes(palabra) || numeroCelular.includes(palabra)
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

  // editarAccesoMultimedia(solicitud: UsuarioSolicitudInterface) {
  //   const nombre = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
  //   const password = this.generarPassword();
  //   Swal.fire({
  //     title: 'CMAR LIVE',
  //     html: `Desea editar las credenciales de ingreso del usuario ${nombre}`,
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí',
  //     cancelButtonText: 'Cancelar',
  //     showCloseButton: true,
  //     allowOutsideClick: false,
  //     allowEscapeKey: false,
  //     icon: 'question',
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       const { value: formValues } = await Swal.fire({
  //         text: `Credenciales para ${nombre}`,
  //         html:
  //           `<p>Credenciales para <b>${nombre}</b></p>` +
  //           `<label class="input-group obligatorio">Login: </label>
  //               <input type="text" id="login" name="login" class="form-control" placeholder="Login" value=${solicitud.login} required/>` +
  //           `<label class="input-group obligatorio">Contraseña: </label>
  //               <input type="password" id="password" name="password" class="form-control" value="${password}" placeholder="Ingrese la contraseña"  required/>` +
  //           `<label class="input-group obligatorio">Tiempo de aprobación:</label>
  //                <input type="date" id="tiempoAprobacion" name="tiempoAprobacion" class="form-control" placeholder="Ingrese el tiempo de aprobación" value=${
  //                  solicitud.solicitudes[-1].tiempoAprobacion
  //                } required/>` +
  //           `<small class="text-danger text-start">Por favor, diligencie todos los campos</small>`,
  //         focusConfirm: true,
  //         allowOutsideClick: false,
  //         showCloseButton: true,
  //         allowEscapeKey: false,
  //         preConfirm: () => {
  //           return [
  //             (document.getElementById('login') as HTMLInputElement).value,
  //             (document.getElementById('password') as HTMLInputElement).value,
  //             (document.getElementById('tiempoAprobacion') as HTMLInputElement).value,
  //           ];
  //         },
  //       });

  //       if (formValues) {
  //         const dataAcceso: LoginUsuarioCmarLiveInterface = {
  //           login: (document.getElementById('login') as HTMLInputElement).value,
  //           password: (document.getElementById('password') as HTMLInputElement).value,
  //           solicitud_id: solicitud.id,
  //           tiempoAprobacion: new Date((document.getElementById('tiempoAprobacion') as HTMLInputElement).value),
  //           estado: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.APROBADA,
  //           usuarioQueAprobo_id: this.usuarioId,
  //         };

  //         this.accesoMultimediaService.actualizarAccesoMultimedia(dataAcceso, solicitud.id).subscribe(
  //           (accesoActualizado: any) => {
  //             Swal.fire(
  //               'CMAR LIVE',
  //               `Se han actualizado las credenciales de ingreso correctamente del usuario ${nombre}`,
  //               'success'
  //             );
  //             // this.cargarSolicitudDeAccesos();
  //           },
  //           (error) => {
  //             let errores = error.error.errors;
  //             let listaErrores: string[] = [];

  //             if (!!errores) {
  //               Object.entries(errores).forEach(([key, value]) => {
  //                 if (typeof value === 'object' && value !== null && 'msg' in value) {
  //                   listaErrores.push('° ' + (value as { msg: string })['msg'] + '<br>');
  //                 }
  //               });
  //             }

  //             Swal.fire({
  //               title: 'El acceso NO ha sido creado',
  //               icon: 'error',
  //               html: listaErrores.join('') ? `${listaErrores.join('')}` : error.error.msg,
  //             });
  //           }
  //         );
  //       }
  //     } else if (result.isDenied) {
  //       Swal.fire('No se pudo crear las credeciales de CMAR LIVE', '', 'info');
  //     }
  //   });
  // }

  eliminarAccesoMultimedia(solicitud: UsuarioSolicitudInterface) {
    const nombre = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      icon: 'question',
      html: `Desea deshabilitar el acceso a CMAR LIVE al usuario ${nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.accesoMultimediaService
          .eliminarAccesoMultimedia(solicitud.solicitudes[-1].id)
          .subscribe((respuesta: any) => {
            Swal.fire({
              title: 'CMAR LIVE',
              icon: 'warning',
              html: `Se deshabilitó el acceso a CMAR LIVE al usuario ${nombre}`,
              showCloseButton: true,
            });
          });
        // this.cargarSolicitudDeAccesos();
      }
    });
  }

  activarAccesoMultimedia(solicitud: UsuarioSolicitudInterface) {
    const nombre = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      html: `Desea activar el acceso a CMAR LIVE al usuario ${nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        // this.accesoMultimediaService.activarAccesoMultimedia('').subscribe((respuesta: any) => {
        //   Swal.fire({
        //     title: 'CMAR LIVE',
        //     icon: 'warning',
        //     html: `Se activo el acceso CMAR LIVE al usuario ${nombre}`,
        //   });
        // });
        // this.cargarSolicitudDeAccesos();
      }
    });
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
}
