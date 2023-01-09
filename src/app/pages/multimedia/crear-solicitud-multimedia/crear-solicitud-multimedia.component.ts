import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { OpcionTransporteModel } from 'src/app/core/models/opcion-transporte.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { RAZON_SOLICITUD_ID, SolicitudMultimediaInterface } from 'src/app/core/models/solicitud-multimedia';
import { TipoEstudioModel } from 'src/app/core/models/tipo-estudio.model';
import { BuscarCorreoService } from 'src/app/services/buscar-correo/buscar-correo.service';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-solicitud-multimedia',
  templateUrl: './crear-solicitud-multimedia.component.html',
  styleUrls: ['./crear-solicitud-multimedia.component.scss'],
})
export class CrearSolicitudMultimediaComponent implements OnInit, OnDestroy {
  public solicitudForm: FormGroup;

  public paises: PaisModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public razonSolicitudes: RazonSolicitudModel[] = [];
  public tipoEstudios: TipoEstudioModel[] = [];
  public opcionTransporte: OpcionTransporteModel[] = [];
  public parentescos: ParentescoModel[] = [];

  public mensajeBuscarCorreo: string = '';

  public idUsuario: number;
  public nombreUsuario: string;

  // Subscription
  public buscarCorreoSubscription: Subscription;

  // time: Date = new Date();
  time: any;

  codigoDeMarcadoSeparado = false;
  buscarPais = SearchCountryField;
  paisISO = CountryISO;
  formatoNumeroTelefonico = PhoneNumberFormat;
  paisesPreferidos: CountryISO[] = [
    CountryISO.PuertoRico,
    CountryISO.Canada,
    CountryISO.Chile,
    CountryISO.Colombia,
    CountryISO.CostaRica,
    CountryISO.Ecuador,
    CountryISO.ElSalvador,
    CountryISO.Spain,
    CountryISO.UnitedStates,
    CountryISO.Italy,
    CountryISO.Mexico,
    CountryISO.Panama,
    CountryISO.Peru,
    CountryISO.DominicanRepublic,
    CountryISO.Venezuela,
  ];

  letrasFiltrarNacionalidad: Observable<NacionalidadModel[]>;
  letrasFiltrarCongregacion: Observable<CongregacionModel[]>;
  pickerTwo: any;

  get RAZON_SOLICITUD_ID() {
    return RAZON_SOLICITUD_ID;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private solicitudMultimediaService: SolicitudMultimediaService,
    private usuarioService: UsuarioService,
    private buscarCorreoService: BuscarCorreoService
  ) {}

  ngOnInit(): void {
    //   this.activateRouter.params.subscribe(({ id }) => {
    //     this.buscarCongregacion(id);
    // }
    this.activatedRoute.data.subscribe(
      (data: {
        nacionalidad: NacionalidadModel[];
        congregacion: CongregacionModel[];
        pais: PaisModel[];
        razonSolicitud: RazonSolicitudModel[];
        tipoEstudio: TipoEstudioModel[];
        opcionTransporte: OpcionTransporteModel[];
        parentesco: ParentescoModel[];
      }) => {
        this.nacionalidades = data.nacionalidad;
        this.congregaciones = data.congregacion;
        this.paises = data.pais;
        this.razonSolicitudes = data.razonSolicitud;
        this.tipoEstudios = data.tipoEstudio;
        this.opcionTransporte = data.opcionTransporte;
        this.parentescos = data.parentesco;
      }
    );

    this.idUsuario = this.usuarioService?.usuarioLogin.id;
    this.nombreUsuario = this.usuarioService.usuarioNombre;

    this.crearFormularioDeLaSolicitud();
  }

  ngOnDestroy(): void {
    this.buscarCorreoSubscription?.unsubscribe();
  }

  crearFormularioDeLaSolicitud() {
    this.solicitudForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required, Validators.minLength(3)]],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      departamento: ['', [Validators.minLength(3)]],
      codigoPostal: ['', [Validators.minLength(3)]],
      pais: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(3)]],
      celular: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      miembroCongregacion: ['', [Validators.required]],
      estaCercaACongregacion: [false, [Validators.required]],
      congregacionCercana: ['', [Validators.minLength(3)]],
      razonSolicitud_id: ['', [Validators.required]],
      otraRazonSolicitud: ['', []],
      nacionalidad: ['', [Validators.required, Validators.minLength(3)]],
      observaciones: ['', [Validators.minLength(3)]],
      tiempoSugerido: ['', []],
      terminos: ['', [Validators.required, Validators.requiredTrue]],
    });
  }

  buscarNacionalidad(formControlName: string) {
    this.letrasFiltrarNacionalidad;
    this.letrasFiltrarNacionalidad = this.solicitudForm.get(formControlName.toString()).valueChanges.pipe(
      startWith(''),
      map((valor) => this.filtrar(valor || ''))
    );
  }

  private filtrar(valor: string): NacionalidadModel[] {
    const filtrarValores = valor.toLowerCase();

    return this.nacionalidades.filter((nacionalidad: NacionalidadModel) =>
      nacionalidad.nombre.toLowerCase().includes(filtrarValores)
    );
  }

  buscarCongregacion(formControlName: string) {
    this.letrasFiltrarCongregacion = this.solicitudForm.get(formControlName.toString()).valueChanges.pipe(
      startWith(''),
      map((valor) => this.filtrarCongregacion(valor || ''))
    );
  }

  private filtrarCongregacion(valor: string): CongregacionModel[] {
    const filtrarCongregaciones = valor.toLowerCase();

    return this.congregaciones.filter((congregacion: CongregacionModel) =>
      congregacion.congregacion.toLowerCase().includes(filtrarCongregaciones)
    );
  }

  buscarIDNacionalidad(nacionalidad: string): number {
    return this.nacionalidades.find((nacionalidades: NacionalidadModel) => nacionalidades.nombre === nacionalidad)?.id;
  }

  buscarCorreo(email: string) {
    this.mensajeBuscarCorreo = '';
    this.buscarCorreoSubscription = this.buscarCorreoService
      .buscarCorreoSolicitud(email)
      .subscribe((respuesta: any) => {
        if (!respuesta.ok) {
          this.mensajeBuscarCorreo = respuesta.msg;
        }
      });
  }

  estaCercaACongregacion() {
    return this.solicitudForm.controls['estaCercaACongregacion'].value || false;
  }

  esPersonaEncamada() {
    return this.solicitudForm?.controls['personaEncamada'].value || false;
  }

  tipoDeSolicitud(tipo: string) {
    this.eliminarControles();
    if (tipo === RAZON_SOLICITUD_ID.ESTUDIANTE) {
      this.agregarControlEsEstudiante();
    } else if (tipo === RAZON_SOLICITUD_ID.FUERZAS_ARMADAS) {
      this.agregarControlBaseMilitar();
    } else if (tipo === RAZON_SOLICITUD_ID.DISTANCIA_AL_TEMPLO_MAS_CERCANO) {
      this.agregarControlOpcionesDeTransporte();
    } else if (tipo === RAZON_SOLICITUD_ID.ENFERMEDAD) {
      this.agregarControlEnfermedad();
    }
  }

  agregarControlEsEstudiante() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      paisDondeEstudia: ['', [Validators.minLength(3), Validators.required]],
      ciudadDondeEstudia: ['', [Validators.minLength(3), Validators.required]],
      tipoDeEstudio_id: ['', [Validators.required]],
      duracionDelPeriodoDeEstudio: ['', [Validators.required]],
    });
    return true;
  }

  eliminarControlEsEstudiante() {
    this.solicitudForm.removeControl('paisDondeEstudia');
    this.solicitudForm.removeControl('ciudadDondeEstudia');
    this.solicitudForm.removeControl('tipoDeEstudio_id');
    this.solicitudForm.removeControl('duracionDelPeriodoDeEstudio');

    return true;
  }

  agregarControlBaseMilitar() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      baseMilitar: ['', [Validators.minLength(3), Validators.required]],
    });
    return true;
  }

  eliminarControlBaseMilitar() {
    this.solicitudForm.removeControl('baseMilitar');

    return true;
  }

  agregarControlOpcionesDeTransporte() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      horaTemploMasCercano: ['', [Validators.min(1), Validators.max(24), Validators.required]],
      opcionTransporte_id: ['', [Validators.required]],
    });
    return true;
  }

  eliminarControlOpcionesDeTransporte() {
    this.solicitudForm.removeControl('horaTemploMasCercano');
    this.solicitudForm.removeControl('opcionTransporte_id');

    return true;
  }

  agregarControlEnfermedad() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      personaEncamada: ['', [Validators.required]],
      personaEncargada: ['', [Validators.minLength(3), Validators.required]],
      parentesco_id: ['', [Validators.required]],
      celularPersonaEncargada: ['', [Validators.minLength(3), Validators.required]],
      enfermedadCronica: ['', [Validators.required]],
      enfermedadQuePadece: ['', [Validators.minLength(3)]],
    });
    return true;
  }

  eliminarControlEnfermedad() {
    this.solicitudForm.removeControl('personaEncamada');

    return true;
  }

  eliminarControles() {
    this.eliminarControlEsEstudiante();
    this.eliminarControlBaseMilitar();
    this.eliminarControlOpcionesDeTransporte();
    this.eliminarControlEnfermedad();
  }

  crearSolicitud() {
    const formSolicitud = this.solicitudForm.value;

    const solicitudNueva: SolicitudMultimediaInterface = {
      nombre: formSolicitud.nombre,
      direccion: formSolicitud.direccion,
      ciudad: formSolicitud.ciudad,
      departamento: formSolicitud.departamento,
      codigoPostal: formSolicitud.codigoPostal,
      pais: formSolicitud.pais,
      telefono: formSolicitud.telefono?.internationalNumber ? formSolicitud.telefono?.internationalNumber : '',
      celular: formSolicitud.celular?.internationalNumber,
      email: formSolicitud.email,
      miembroCongregacion: formSolicitud.miembroCongregacion,
      congregacionCercana: formSolicitud.congregacionCercana,
      razonSolicitud_id: formSolicitud.razonSolicitud_id,
      nacionalidad_id: this.buscarIDNacionalidad(formSolicitud.nacionalidad),
      estado: true,
      status: false,
      usuarioQueRegistra_id: this.idUsuario,
      duracionDelPeriodoDeEstudio: formSolicitud.duracionDelPeriodoDeEstudio
        ? formSolicitud.duracionDelPeriodoDeEstudio
        : '',
      baseMilitar: formSolicitud.baseMilitar ? formSolicitud.baseMilitar : '',
      observaciones: formSolicitud.observaciones ? formSolicitud.observaciones : '',
      opcionTransporte_id: formSolicitud.opcionTransporte_id ? formSolicitud.opcionTransporte_id : null,
      tipoDeEstudio_id: formSolicitud.tipoDeEstudio_id ? formSolicitud.tipoDeEstudio_id : null,
      parentesco_id: formSolicitud.parentesco_id ? formSolicitud.parentesco_id : null,
      tiempoDistancia: formSolicitud.tiempoDistancia ? formSolicitud.tiempoDistancia : '',
      horaTemploMasCercano: formSolicitud.horaTemploMasCercano ? formSolicitud.horaTemploMasCercano : '',
      personaEncamada: formSolicitud.personaEncamada ? formSolicitud.personaEncamada : '',
      personaEncargada: formSolicitud.personaEncargada ? formSolicitud.personaEncargada : '',
      enfermedadCronica: formSolicitud.personaEncargada ? formSolicitud.personaEncargada : '',
      enfermedadQuePadece: formSolicitud.personaEncargada ? formSolicitud.personaEncargada : '',
      paisDondeEstudia: formSolicitud.paisDondeEstudia ? formSolicitud.personaEncargada : '',
      ciudadDondeEstudia: formSolicitud.paisDondeEstudia ? formSolicitud.personaEncargada : '',
      terminos: formSolicitud.terminos ? formSolicitud.terminos : false,
    };

    this.solicitudMultimediaService.crearSolicitudMultimedia(solicitudNueva).subscribe(
      (respuesta: any) => {
        Swal.fire({
          title: 'Solicitud Acceso a cmar.live',
          text: `${respuesta.solicitudDeAcceso.nombre}, por favor revise el correo electrónico ${respuesta.solicitudDeAcceso.email} y realice el proceso de validación para que sea procesada su solicitud`,
          icon: 'success',
        });
        this.resetFormulario();
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Error al crear la solicitud de acceso a cmar.live',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
      }
    );
  }

  resetFormulario() {
    this.solicitudForm.reset();
  }
}
