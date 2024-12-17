import Swal from 'sweetalert2';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { UsuarioSolicitudMultimediaModel } from 'src/app/core/models/usuario-solicitud.model';
import { Subscription } from 'rxjs';
import { ESTADO_SOLICITUD_MULTIMEDIA_ENUM } from 'src/app/core/enums/solicitudMultimendia.enum';
import { generate } from 'generate-password-browser';
import { denegarSolicitudMultimediaInterface } from 'src/app/core/models/solicitud-multimedia.model';
import { Router } from '@angular/router';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { CargandoInformacionComponent } from 'src/app/components/cargando-informacion/cargando-informacion.component';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioSolicitudInterface } from 'src/app/core/interfaces/solicitud-multimedia';
import { configuracion } from 'src/environments/config/configuration';
import { LoginUsuarioCmarLiveInterface } from 'src/app/core/interfaces/acceso-multimedia';
import { NgxPaginationModule } from 'ngx-pagination';
import { TelegramPipe } from 'src/app/pipes/telegram/telegram.pipe';
import { WhatsappPipe } from 'src/app/pipes/whatsapp/whatsapp.pipe';

@Component({
  selector: 'app-solicitud-multimedia',
  templateUrl: './solicitud-multimedia.component.html',
  styleUrls: ['./solicitud-multimedia.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CargandoInformacionComponent,
    NgxPaginationModule,
    TelegramPipe,
    WhatsappPipe,
  ],
})
export class SolicitudMultimediaComponent implements OnInit, OnDestroy {
  solicitudes: UsuarioSolicitudMultimediaModel[] = [];
  filteredSolicitudes: UsuarioSolicitudMultimediaModel[] = [];
  cargando = false;
  usuarioId: number;
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
  };

  get estadosSolicitud() {
    return ESTADO_SOLICITUD_MULTIMEDIA_ENUM;
  }
  // Subscription
  public solicitudAccesoSubscription: Subscription;
  public solicitudMultimediaServiceSubscription: Subscription;

  constructor(
    private router: Router,
    private accesoMultimediaService: AccesoMultimediaService,
    private solicitudMultimediaService: SolicitudMultimediaService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.usuarioService.usuario.id;

    this.filterForm = this.formBuilder.group({
      paises: ['', Validators.required],
      congregaciones: ['', Validators.required],
      campos: ['', Validators.required],
      estados: ['', Validators.required],
      filtroGeneral: ['', Validators.required],
    });

    this.cargarTodasLasSolicitudes();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilter(); // Aplica el filtro cuando cambie cualquier campo
    });
  }

  ngOnDestroy(): void {
    this.solicitudAccesoSubscription?.unsubscribe();
    this.solicitudMultimediaServiceSubscription?.unsubscribe();
  }

  cargarTodasLasSolicitudes(): void {
    this.cargando = true;

    this.solicitudMultimediaServiceSubscription = this.solicitudMultimediaService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = this.mapSolicitudes(data);
        this.filteredSolicitudes = [...this.solicitudes]; // Usar una copia para evitar modificaciones accidentales
        this.transformarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        this.handleError(error);
        this.cargando = false;
      },
    });
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
        (filtroGeneral
          ? solicitud.nombreCompleto.includes(filtroGeneral) ||
            solicitud.email.includes(filtroGeneral) ||
            solicitud.numeroCelular.includes(filtroGeneral)
          : true)
      );
    });
  }

  coincideFiltroGeneral(solicitud: any, filtro: string): boolean {
    // Elimina todos los espacios (intermedios y al inicio o final) y convierte a minúsculas
    const filtroSinEspacios = filtro.replace(/\s+/g, '').toLowerCase();

    return (
      solicitud.nombreCompleto?.replace(/\s+/g, '').toLowerCase().includes(filtroSinEspacios) ||
      solicitud.email?.toLowerCase().includes(filtroSinEspacios) ||
      solicitud.numeroCelular?.toLowerCase().includes(filtroSinEspacios)
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
    const nombreCompleto = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
    const loginDefault = solicitud.email;
    const password = this.generarPassword();

    Swal.fire({
      title: 'CMAR LIVE',
      html: `Desea crear acceso a CMAR LIVE al usuario <b>${nombreCompleto}</b>`,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: 'question',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: formValues } = await Swal.fire({
          title: `Credenciales para ${nombreCompleto}`,
          html: `
          <div class="form-group">
            <label class="input-group obligatorio">Login:</label>
            <input type="text" id="login" name="login" class="form-control" value="${loginDefault}" required />
          </div>
          <div class="form-group">
            <label class="input-group obligatorio">Contraseña:</label>
            <input type="password" id="password" name="password" class="form-control" value="${password}" required />
          </div>
          <div class="form-group">
            <label class="input-group obligatorio">Tiempo de aprobación:</label>
            <select id="tiempoAprobacion" name="tiempoAprobacion" class="form-control" required>
              <option value="" disabled selected>Seleccionar tiempo de aprobación</option>
              ${configuracion.tiempoSugerido
                .map((tiempo) => `<option value="${tiempo.value}">${tiempo.label}</option>`)
                .join('')}
            </select>
          </div>
        `,
          focusConfirm: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCloseButton: true,
          preConfirm: () => {
            return [
              (document.getElementById('login') as HTMLInputElement).value,
              (document.getElementById('password') as HTMLInputElement).value,
              (document.getElementById('tiempoAprobacion') as HTMLSelectElement).value,
            ];
          },
        });

        if (formValues) {
          const tiempoSeleccionado = formValues[2];

          const tiempoAprobacion = this.calcularFechaDeAprobacion(tiempoSeleccionado);

          const dataAcceso: LoginUsuarioCmarLiveInterface = {
            login: formValues[0],
            password: formValues[1],
            solicitud_id: solicitud?.solicitudes[solicitud.solicitudes.length - 1]?.id,
            tiempoAprobacion: tiempoAprobacion ? new Date(tiempoAprobacion) : null,
            usuarioQueAprobo_id: this.usuarioId,
            estado: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.APROBADA,
          };

          this.accesoMultimediaService.crearAccesoMultimedia(dataAcceso).subscribe(
            (accesoCreado: any) => {
              Swal.fire('Acceso creado', 'correctamente', 'success');
              this.cargarTodasLasSolicitudes();
            },
            (error) => {
              let errorMessage = 'Error al crear el acceso.';

              Swal.fire({
                title: 'Error',
                icon: 'info',
                html: `${errorMessage} ${error.error.msg}`,
              });
            }
          );
        }
      } else if (result.isDenied) {
        Swal.fire('No se pudo crear las credenciales de CMAR LIVE', '', 'info');
      }
    });
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

  editarAccesoMultimedia(solicitud: UsuarioSolicitudInterface) {
    const nombre = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
    const password = this.generarPassword();
    Swal.fire({
      title: 'CMAR LIVE',
      html: `Desea editar las credenciales de ingreso del usuario ${nombre}`,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: 'question',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: formValues } = await Swal.fire({
          text: `Credenciales para ${nombre}`,
          html:
            `<p>Credenciales para <b>${nombre}</b></p>` +
            `<label class="input-group obligatorio">Login: </label>
              <input type="text" id="login" name="login" class="form-control" placeholder="Login" value=${solicitud.login} required/>` +
            `<label class="input-group obligatorio">Contraseña: </label>
              <input type="password" id="password" name="password" class="form-control" value="${password}" placeholder="Ingrese la contraseña"  required/>` +
            `<label class="input-group obligatorio">Tiempo de aprobación:</label>
               <input type="date" id="tiempoAprobacion" name="tiempoAprobacion" class="form-control" placeholder="Ingrese el tiempo de aprobación" value=${
                 solicitud.solicitudes[-1].tiempoAprobacion
               } required/>` +
            `<small class="text-danger text-start">Por favor, diligencie todos los campos</small>`,
          focusConfirm: true,
          allowOutsideClick: false,
          showCloseButton: true,
          allowEscapeKey: false,
          preConfirm: () => {
            return [
              (document.getElementById('login') as HTMLInputElement).value,
              (document.getElementById('password') as HTMLInputElement).value,
              (document.getElementById('tiempoAprobacion') as HTMLInputElement).value,
            ];
          },
        });

        if (formValues) {
          const dataAcceso: LoginUsuarioCmarLiveInterface = {
            login: (document.getElementById('login') as HTMLInputElement).value,
            password: (document.getElementById('password') as HTMLInputElement).value,
            solicitud_id: solicitud.id,
            tiempoAprobacion: new Date((document.getElementById('tiempoAprobacion') as HTMLInputElement).value),
            estado: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.APROBADA,
            usuarioQueAprobo_id: this.usuarioId,
          };

          this.accesoMultimediaService.actualizarAccesoMultimedia(dataAcceso, solicitud.id).subscribe(
            (accesoActualizado: any) => {
              Swal.fire(
                'CMAR LIVE',
                `Se han actualizado las credenciales de ingreso correctamente del usuario ${nombre}`,
                'success'
              );
              // this.cargarSolicitudDeAccesos();
            },
            (error) => {
              let errores = error.error.errors;
              let listaErrores: string[] = [];

              if (!!errores) {
                Object.entries(errores).forEach(([key, value]) => {
                  if (typeof value === 'object' && value !== null && 'msg' in value) {
                    listaErrores.push('° ' + (value as { msg: string })['msg'] + '<br>');
                  }
                });
              }

              Swal.fire({
                title: 'El acceso NO ha sido creado',
                icon: 'error',
                html: listaErrores.join('') ? `${listaErrores.join('')}` : error.error.msg,
              });
            }
          );
        }
      } else if (result.isDenied) {
        Swal.fire('No se pudo crear las credeciales de CMAR LIVE', '', 'info');
      }
    });
  }

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
    const nombre = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      html: `Desea denegar la solicitud CMAR LIVE al usuario <b>${nombre}</b><br><br>
      <small>Por favor ingrese el motivo de la negación</small>
             <textarea id="motivo" class="swal2-textarea" placeholder="Por favor ingrese el motivo de la negación"></textarea>`,
      preConfirm: () => {
        const motivo = (Swal.getPopup()!.querySelector('#motivo') as HTMLTextAreaElement).value;
        if (!motivo) {
          Swal.showValidationMessage('Por favor ingrese el motivo de la negación');
        }
        return { motivo };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const motivo = result.value!.motivo;

        const dataDenegar: denegarSolicitudMultimediaInterface = {
          solicitud_id: solicitud.solicitudes[solicitud.solicitudes.length - 1].id,
          motivoDeNegacion: motivo,
        };
        this.solicitudMultimediaService.denegarSolicitudMultimedia(dataDenegar).subscribe((respuesta: any) => {
          Swal.fire({
            title: 'CMAR LIVE',
            icon: 'warning',
            html: `Se denegó la solicitud de acceso a CMAR LIVE al usuario <b>${nombre}</b> por el siguiente motivo: <p><br><br>${motivo}</p>`,
          });
          this.cargarTodasLasSolicitudes();
        });
      }
    });
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

  generarPassword() {
    const password = generate({
      length: 10,
      numbers: true,
    });

    return password;
  }

  toggleIcons(solicitud: UsuarioSolicitudInterface) {
    this.selectedContact = this.selectedContact === solicitud.id ? null : solicitud.id;
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }
}
