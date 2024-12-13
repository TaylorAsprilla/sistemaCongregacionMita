import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { denegarSolicitudMultimediaInterface } from 'src/app/core/models/solicitud-multimedia.model';
import { configuracion } from 'src/environments/config/configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import Swal from 'sweetalert2';
import { generate } from 'generate-password-browser';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { LoginUsuarioCmarLiveInterface } from 'src/app/core/interfaces/acceso-multimedia';
import { CargandoInformacionComponent } from '../../../../components/cargando-informacion/cargando-informacion.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsuarioSolicitudInterface } from 'src/app/core/interfaces/solicitud-multimedia';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TelegramPipe } from 'src/app/pipes/telegram/telegram.pipe';
import { WhatsappPipe } from 'src/app/pipes/whatsapp/whatsapp.pipe';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ESTADO_SOLICITUD_MULTIMEDIA_ENUM } from 'src/app/core/enums/solicitudMultimendia.enum';
import { UsuarioSolicitudMultimediaModel } from 'src/app/core/models/usuario-solicitud.model';

@Component({
  selector: 'app-solicitud-multimedia',
  templateUrl: './solicitud-multimedia.component.html',
  styleUrls: ['./solicitud-multimedia.component.scss'],
  standalone: true,
  imports: [
    CargandoInformacionComponent,
    NgxPaginationModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    TelegramPipe,
    WhatsappPipe,
  ],
  providers: [SolicitudMultimediaService],
})
export class SolicitudMultimediaComponent implements OnInit, OnDestroy {
  solicitudes: UsuarioSolicitudMultimediaModel[] = [];
  nacionalidades: NacionalidadModel[] = [];
  tipoMiembro: TipoMiembroModel[];
  cargando: boolean = false;
  fieldTextType: boolean;
  pagina: number = 1;
  filterTerm: string = '';
  selectedContact: number | null;
  paises: { nombre: string }[] = [];
  congregaciones: { nombre: string }[] = [];
  campos: { nombre: string }[] = [];
  selectedPaises: string[] = [];
  selectedCongregaciones: string[] = [];
  selectedCampos: string[] = [];
  estados: { label: string; value: string }[] = [];
  usuarioId: number;
  searchValue: string | undefined;

  // Subscription
  public solicitudAccesoSubscription: Subscription;
  public solicitudMultimediaServiceSubscription: Subscription;

  constructor(
    private router: Router,
    private accesoMultimediaService: AccesoMultimediaService,
    private solicitudMultimediaService: SolicitudMultimediaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.usuarioService.usuario.id;

    this.estados = [
      { label: 'Denegada', value: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.DENEGADA },
      { label: 'Aprobada', value: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.APROBADA },
      { label: 'Eliminada', value: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.ELIMINADA },
      { label: 'Caducada', value: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.CADUCADA },
      { label: 'PENDIENTE', value: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.PENDIENTE },
    ];

    this.cargarTodasLasSolicitudes();
  }

  ngOnDestroy(): void {
    this.solicitudAccesoSubscription?.unsubscribe;
    this.solicitudMultimediaServiceSubscription?.unsubscribe;
  }

  async cargarTodasLasSolicitudes(): Promise<void> {
    this.cargando = true;
    try {
      const data = await this.solicitudMultimediaService.getSolicitudes().toPromise();
      this.solicitudes = this.mapSolicitudes(data);
      console.log(this.solicitudes);
      this.transformarFiltros();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.cargando = false;
    }
  }

  mapSolicitudes(data: any[]): UsuarioSolicitudMultimediaModel[] {
    return data.map(
      (item: any) =>
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

    this.solicitudes.forEach((solicitud) => {
      if (solicitud.pais && solicitud.pais !== null && solicitud.pais !== undefined) {
        paisesSet.add(solicitud.pais);
      }
      if (solicitud.congregacion && solicitud.congregacion !== null && solicitud.congregacion !== undefined) {
        congregacionesSet.add(solicitud.congregacion);
      }
      if (solicitud.campo && solicitud.campo !== null && solicitud.campo !== undefined) {
        camposSet.add(solicitud.campo);
      }
    });

    this.paises = Array.from(paisesSet).map((pais) => ({ nombre: pais }));
    this.congregaciones = Array.from(congregacionesSet).map((congregacion) => ({ nombre: congregacion }));
    this.campos = Array.from(camposSet).map((campo) => ({ nombre: campo }));

    console.log(this.paises, this.congregaciones, this.campos);
  }

  onPaisChange(value: { nombre: string }[], dt: Table): void {
    this.selectedPaises = value.map((pais) => pais.nombre);

    console.log('this.selectedPaises', this.selectedPaises);
    dt.filter(this.selectedPaises, 'pais', 'in');
  }

  onCongregacionChange(value: { nombre: string }[], dt: Table): void {
    this.selectedCongregaciones = value.map((congregacion) => congregacion.nombre);
    dt.filter(this.selectedCongregaciones, 'congregacion', 'in');
  }

  onCampoChange(value: { nombre: string }[], dt: Table): void {
    this.selectedCampos = value.map((campo) => campo.nombre);
    dt.filter(this.selectedCampos, 'campo', 'in');
  }

  onEstadoChange(value: string, dt: Table): void {
    dt.filter(value, 'solicitudes.estadoUltimaSolicitud', 'equals');
    console.log(dt);
  }

  getSeverity(status: string) {
    switch (status) {
      case ESTADO_SOLICITUD_MULTIMEDIA_ENUM.DENEGADA:
        return 'danger';
      case ESTADO_SOLICITUD_MULTIMEDIA_ENUM.APROBADA:
        return 'success';
      case ESTADO_SOLICITUD_MULTIMEDIA_ENUM.ELIMINADA:
        return 'warning';
      case ESTADO_SOLICITUD_MULTIMEDIA_ENUM.CADUCADA:
        return 'secondary';
      case ESTADO_SOLICITUD_MULTIMEDIA_ENUM.PENDIENTE:
        return 'info';
      default:
        return null;
    }
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  toggleAccordion(id: number): void {
    const elements = document.querySelectorAll('.accordion-collapse');
    elements.forEach((element) => {
      if (element.id === `collapse${id}`) {
        const isCollapsed = element.classList.contains('show');
        if (isCollapsed) {
          element.classList.remove('show');
        } else {
          element.classList.add('show');
        }
      } else {
        element.classList.remove('show');
      }
    });
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

  onTableDataChange(event: any) {
    this.pagina = event;
  }

  toggleIcons(solicitud: UsuarioSolicitudInterface) {
    this.selectedContact = this.selectedContact === solicitud.id ? null : solicitud.id;
  }
}
