import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { RegisterFormInterface } from 'src/app/core/interfaces/register-form.interface';
import { CampoModel, CONGREGACION_CAMPO } from 'src/app/core/models/campo.model';
import { CONGREGACION, CongregacionModel } from 'src/app/core/models/congregacion.model';
import { DosisModel } from 'src/app/core/models/dosis.model';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { TipoDocumentoModel, TIPO_DOCUMENTO_ID } from 'src/app/core/models/tipo-documento.model';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { BuscarCorreoService } from 'src/app/services/buscar-correo/buscar-correo.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';
import { BuscarCelularService } from 'src/app/services/buscar-celular/buscar-celular.service';
import { CONGREGACION_PAIS, ID_PAIS } from 'src/app/core/enums/congregacionPais.enum';

@Component({
  selector: 'app-informacion-usuario',
  templateUrl: './informacion-usuario.component.html',
  styleUrls: ['./informacion-usuario.component.scss'],
})
export class InformacionUsuarioComponent implements OnInit {
  registroUnoForm!: FormGroup;
  registroDosForm!: FormGroup;
  registroTresForm!: FormGroup;
  registroCuatroForm!: FormGroup;

  registroUno_step = false;
  registroDos_step = false;
  registroTres_step = false;
  step: number = 1;

  @Input() usuario: UsuarioModel;
  @Input() usuarios: UsuarioModel[] = [];
  @Input() generos: GeneroModel[] = [];
  @Input() estadoCivil: EstadoCivilModel[] = [];
  @Input() rolCasa: RolCasaModel[] = [];
  @Input() paises: CongregacionPaisModel[] = [];
  @Input() congregaciones: CongregacionModel[] = [];
  @Input() campos: CampoModel[] = [];
  @Input() dosis: DosisModel[] = [];
  @Input() nacionalidades: NacionalidadModel[] = [];
  @Input() gradosAcademicos: GradoAcademicoModel[] = [];
  @Input() tipoMiembros: TipoMiembroModel[] = [];
  @Input() ministerios: MinisterioModel[] = [];
  @Input() voluntariados: VoluntariadoModel[] = [];
  @Input() tiposDeDocumentos: TipoDocumentoModel[] = [];
  @Input() tipoDeDocumentosFiltrados: TipoDocumentoModel[] = [];
  @Input() usuarioMinisterios: number[] = [];
  @Input() usuarioVoluntariados: number[] = [];
  @Input() idUsuarioQueRegistra: number;

  @Input() usuarioForm: FormGroup;
  @Input() codigoDeMarcadoSeparado = false;
  @Input() buscarPais = SearchCountryField;
  @Input() paisISO = CountryISO;
  @Input() formatoNumeroTelefonico = PhoneNumberFormat;
  @Input() paisesPreferidos: CountryISO[] = [
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

  @Output() operacion = new EventEmitter<RegisterFormInterface>();

  letrasFiltrarNacionalidad: Observable<NacionalidadModel[]>;

  usuarioSeleccionado: UsuarioModel;
  congregacionesFiltradas: CongregacionModel[] = [];
  camposFiltrados: CampoModel[] = [];

  mensajeBuscarCorreo: string = '';
  mensajeBuscarCelular: string = '';
  sinCongregacion: number;
  sinCampo: number;

  fechaDeNacimiento: Date;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellio: string;
  apodo: string;
  email: string;
  genero_id: number;
  estadoCivil_id: number;
  nacionalidad: string;
  rolEnCasa: number;
  celular: string;
  telefonoCasa: string;
  direccion: string;
  ciudadDireccion: string;
  departamentoDireccion: string;
  codigoPostalDireccion: string;
  paisDireccion: string;
  direccionPostal: string;
  ciudadPostal: string;
  departamentoPostal: string;
  codigoPostal: string;
  paisPostal: string;
  gradoAcademico: number;
  ocupacion: string;
  especializacionEmpleo: string;
  tipoMiembro: number;
  esjoven: number;
  ejerMinisterio: boolean;
  voluntario: boolean;
  ministerioUsuario: number[];
  voluntarioUsuario: number[];
  congregacionPais: number;
  congreacionCiudad: number;
  congregacionCampo: number;
  dosisUsuario: number;
  tipoDeDocumento: string;
  numeroDocumento: string;
  anoConocimiento: string;

  direccionResidenciaValues: any;

  mostrarPoliticaDatos: boolean = false;

  // Subscription
  usuarioSubscription: Subscription;
  buscarCorreoSubscription: Subscription;
  buscarCelularSubscription: Subscription;

  get CONGREGACION_CAMPO() {
    return CONGREGACION_CAMPO;
  }

  get CONGREGACION() {
    return CONGREGACION;
  }

  get CONGREGACION_PAIS() {
    return CONGREGACION_PAIS;
  }

  constructor(
    private formBuilder: FormBuilder,
    private buscarCorreoService: BuscarCorreoService,
    private buscarCelularService: BuscarCelularService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.informacionDelUsuario();
    this.crearFormularios();

    this.tieneTipoDocumento();
    this.filtrarCongregacionesPorPais(this.usuario?.usuarioCongregacionPais[0]?.id);
    this.filtrarCamposPorCongregacion(this.usuario?.usuarioCongregacionCongregacion[0]?.id);
    this.onPaisChange();
  }

  informacionDelUsuario() {
    this.fechaDeNacimiento = this.usuario?.fechaNacimiento ? this.usuario.fechaNacimiento : null;
    this.primerNombre = this.usuario?.primerNombre ? this.usuario.primerNombre : '';
    this.segundoNombre = this.usuario?.segundoNombre ? this.usuario.segundoNombre : '';
    this.primerApellido = this.usuario?.primerApellido ? this.usuario.primerApellido : '';
    this.segundoApellio = this.usuario?.segundoApellido ? this.usuario.segundoApellido : '';
    this.apodo = this.usuario?.apodo ? this.usuario.apodo : '';
    this.email = this.usuario?.email ? this.usuario.email : null;
    this.genero_id = this.usuario?.genero_id ? this.usuario.genero_id : null;
    this.estadoCivil_id = this.usuario?.estadoCivil_id ? this.usuario.estadoCivil_id : null;
    this.nacionalidad = this.usuario?.nacionalidad?.nombre ? this.usuario.nacionalidad?.nombre : '';
    this.rolEnCasa = this.usuario?.rolCasa_id ? this.usuario.rolCasa_id : null;
    this.celular = this.usuario?.numeroCelular ? this.usuario.numeroCelular : null;
    this.telefonoCasa = this.usuario?.telefonoCasa ? this.usuario.telefonoCasa : '';
    this.direccion = this.usuario?.direccion;
    this.ciudadDireccion = this.usuario?.ciudadDireccion;
    this.departamentoDireccion = this.usuario?.departamentoDireccion;
    this.codigoPostalDireccion = this.usuario?.codigoPostalDireccion;
    this.paisDireccion = this.usuario?.paisDireccion;
    this.direccionPostal = this.usuario?.direccionPostal;
    this.ciudadPostal = this.usuario?.ciudadPostal;
    this.departamentoPostal = this.usuario?.departamentoPostal;
    this.codigoPostal = this.usuario?.codigoPostal;
    this.paisPostal = this.usuario?.paisPostal;
    this.gradoAcademico = this.usuario?.gradoAcademico_id ? this.usuario.gradoAcademico_id : null;
    this.ocupacion = this.usuario?.ocupacion ? this.usuario?.ocupacion : '';
    this.especializacionEmpleo = this.usuario?.especializacionEmpleo ? this.usuario.especializacionEmpleo : '';
    this.tipoMiembro = this.usuario?.tipoMiembro_id ? this.usuario.tipoMiembro_id : null;
    this.esjoven = this.usuario?.esJoven ? 1 : 0;
    this.ejerMinisterio = !!this.usuario?.usuarioMinisterio?.length;
    this.voluntario = !!this.usuario?.usuarioVoluntariado?.length;
    this.ministerioUsuario = this.usuarioMinisterios ? this.usuarioMinisterios : null;
    this.voluntarioUsuario = this.usuarioVoluntariados ? this.usuarioVoluntariados : null;
    this.congregacionPais = this.usuario?.usuarioCongregacionPais[0]?.pais
      ? this.usuario?.usuarioCongregacionPais[0]?.pais
      : null;
    this.congreacionCiudad = this.usuario?.usuarioCongregacionCongregacion[0]?.congregacion
      ? this.usuario?.usuarioCongregacionCongregacion[0]?.congregacion
      : null;
    this.congregacionCampo = this.usuario?.usuarioCongregacionCampo[0]?.campo
      ? this.usuario?.usuarioCongregacionCampo[0]?.campo
      : null;
    this.tipoDeDocumento = this.usuario?.tipoDocumento_id
      ? this.usuario.tipoDocumento_id.toString()
      : TIPO_DOCUMENTO_ID.SIN_DOCUMENTO;
    this.numeroDocumento = this.usuario?.numeroDocumento ? this.usuario?.numeroDocumento : '';
    this.anoConocimiento = this.usuario?.anoConocimiento ? this.usuario?.anoConocimiento : '';
  }

  crearFormularios() {
    const controlMinisterios = this.ministerios.map((control) => this.formBuilder.control(false));
    const controlVoluntariados = this.voluntariados.map((control) => this.formBuilder.control(false));

    this.registroUnoForm = this.formBuilder.group({
      fechaNacimiento: [this.fechaDeNacimiento, [Validators.required]],
      primerNombre: [this.primerNombre, [Validators.required, Validators.minLength(3)]],
      segundoNombre: [this.segundoNombre, [Validators.minLength(3)]],
      primerApellido: [this.primerApellido, [Validators.required, Validators.minLength(3)]],
      segundoApellido: [this.segundoApellio, [Validators.minLength(3)]],
      apodo: [this.apodo, [Validators.minLength(3)]],
      email: [this.email, [Validators.email]],
      genero_id: [this.genero_id, [Validators.required]],
      estadoCivil_id: [this.estadoCivil_id, [Validators.required]],
    });

    this.registroDosForm = this.formBuilder.group({
      nacionalidad: [this.nacionalidad, [Validators.required, Validators.minLength(3)]],
      rolCasa_id: [this.rolEnCasa, [Validators.required]],
      numeroCelular: [
        this.celular,
        { validators: [Validators.minLength(3)], asyncValidators: [this.buscarCelular()], updateOn: 'blur' },
      ],
      telefonoCasa: [this.telefonoCasa, [Validators.minLength(3)]],
      direccion: [this.direccion, [Validators.required, Validators.minLength(3)]],
      ciudadDireccion: [this.ciudadDireccion, [Validators.required, Validators.minLength(3)]],
      departamentoDireccion: [this.departamentoDireccion, [Validators.minLength(3)]],
      codigoPostalDireccion: [this.codigoPostalDireccion, [Validators.minLength(3)]],
      paisDireccion: [this.paisDireccion, [Validators.required, Validators.minLength(3)]],
      mismaDireccionPostal: [],
      direccionPostal: [this.direccionPostal, [Validators.minLength(5)]],
      ciudadPostal: [this.ciudadPostal, [Validators.minLength(3)]],
      departamentoPostal: [this.departamentoPostal, [Validators.minLength(3)]],
      codigoPostal: [this.codigoPostal, [Validators.minLength(3)]],
      paisPostal: [this.paisPostal, [Validators.minLength(3)]],
    });

    this.registroTresForm = this.formBuilder.group({
      gradoAcademico_id: [this.gradoAcademico, [Validators.required]],
      ocupacion: [this.ocupacion, [Validators.minLength(3), Validators.required]],
      especializacionEmpleo: [this.especializacionEmpleo, [Validators.minLength(3)]],
    });

    this.registroCuatroForm = this.formBuilder.group({
      tipoMiembro_id: [this.tipoMiembro, [Validators.required]],
      congregacionPais_id: [this.usuario?.usuarioCongregacionPais[0]?.id, [Validators.required]],
      congregacion_id: [this.usuario?.usuarioCongregacionCongregacion[0]?.id, [Validators.required]],
      campo_id: [this.usuario?.usuarioCongregacionCampo[0]?.id, [Validators.required]],
      esJoven: [this.esjoven, [Validators.required]],
      ejerceMinisterio: [!!this.usuario?.usuarioMinisterio?.length, [Validators.required]],
      esVoluntario: [!!this.usuario?.usuarioVoluntariado?.length, [Validators.required]],
      ministerio: this.formBuilder.array(controlMinisterios),
      voluntariado: this.formBuilder.array(controlVoluntariados),
      anoConocimiento: [this.anoConocimiento, []],
      mismaFechaDeNacimiento: [],
      aceptaPolitica: [false, Validators.requiredTrue],
    });

    this.patchValueMinisterios();
    this.patchValueVoluntariados();
  }

  get ministeriosArr() {
    return this.registroCuatroForm.get('ministerio') as FormArray;
  }

  get voluntariadosArr() {
    return this.registroCuatroForm.get('voluntariado') as FormArray;
  }

  patchValueMinisterios() {
    this.ministerios.map((ministerio: MinisterioModel, i: number) => {
      if (this.ministerioUsuario?.indexOf(ministerio.id) !== -1) {
        this.ministeriosArr.at(i)?.patchValue(true);
      }
    });
  }

  patchValueVoluntariados() {
    this.voluntariados.map((voluntariado: VoluntariadoModel, i: number) => {
      if (this.voluntarioUsuario?.indexOf(voluntariado.id) !== -1) {
        this.voluntariadosArr.at(i)?.patchValue(true);
      }
    });
  }

  onCheckboxMinisteriosChange(event: any) {
    const selectedMinisterios = this.registroCuatroForm.controls['ministerio'] as FormArray;

    if (event.target.checked) {
      selectedMinisterios.push(new FormControl(event.target.value));
    } else {
      const index = selectedMinisterios.controls.findIndex((x) => x.value === event.target.value);
      selectedMinisterios.removeAt(index);
    }
  }

  onCheckboxVoluntariadosChange(event: any) {
    const selectedVoluntariados = this.registroCuatroForm.controls['voluntariado'] as FormArray;
    if (event.target.checked) {
      selectedVoluntariados.push(new FormControl(event.target.value));
    } else {
      const index = selectedVoluntariados.controls.findIndex((x) => x.value === event.target.value);
      selectedVoluntariados.removeAt(index);
    }
  }

  ejerceAlgunMinisterio() {
    return this.registroCuatroForm.controls['ejerceMinisterio'].value || false;
  }

  esVoluntario() {
    return this.registroCuatroForm.controls['esVoluntario'].value || false;
  }

  resetFormulario() {
    this.registroUnoForm.reset();
    this.registroDosForm.reset();
    this.registroTresForm.reset();
    this.registroCuatroForm.reset();
  }

  guardarUsuario() {
    console.log(
      'Formulario uno',
      this.registroUnoForm,
      'Formulario Dos',
      this.registroDosForm,
      'Formulario Tres',
      this.registroTresForm,
      'Formulario Cuatro',
      this.registroCuatroForm
    );

    if (
      this.step == 4 &&
      this.registroUnoForm.valid &&
      this.registroDosForm.valid &&
      this.registroTresForm.valid &&
      this.registroCuatroForm.valid
    ) {
      let informacionFormulario = Object.assign(
        this.registroUnoForm.value,
        this.registroDosForm.value,
        this.registroTresForm.value,
        this.registroCuatroForm.value
      );

      if (!informacionFormulario.ejerceMinisterio) {
        this.deseleccionarMinisterios();
      }

      if (!informacionFormulario.esVoluntario) {
        this.deseleccionarVoluntariados();
      }

      const usuarioNuevo: RegisterFormInterface = {
        primerNombre: informacionFormulario?.primerNombre,
        segundoNombre: informacionFormulario.segundoNombre ? informacionFormulario.segundoNombre : '',
        primerApellido: informacionFormulario?.primerApellido,
        segundoApellido: informacionFormulario.segundoApellido ? informacionFormulario.segundoApellido : '',
        apodo: informacionFormulario.apodo ? informacionFormulario.apodo : '',
        nacionalidad_id: this.buscarIDNacionalidad(informacionFormulario.nacionalidad),
        email: informacionFormulario.email ? informacionFormulario.email : null,
        numeroCelular: informacionFormulario.numeroCelular?.internationalNumber
          ? informacionFormulario.numeroCelular?.internationalNumber
          : null,
        telefonoCasa: informacionFormulario.telefonoCasa?.internationalNumber
          ? informacionFormulario.telefonoCasa?.internationalNumber
          : null,
        fechaNacimiento: informacionFormulario?.fechaNacimiento,
        genero_id: informacionFormulario?.genero_id,
        estadoCivil_id: informacionFormulario?.estadoCivil_id,
        gradoAcademico_id: informacionFormulario.gradoAcademico_id,
        ocupacion: informacionFormulario.ocupacion,
        especializacionEmpleo: informacionFormulario.especializacionEmpleo,
        tipoMiembro_id: informacionFormulario?.tipoMiembro_id,
        esJoven: informacionFormulario.esJoven,
        ministerios: this.ministeriosSeleccionados(),
        voluntariados: this.voluntariadosSelecionados(),
        congregacion: {
          pais_id: informacionFormulario.congregacionPais_id,
          congregacion_id: informacionFormulario.congregacion_id,
          campo_id: informacionFormulario.campo_id,
        },
        rolCasa_id: informacionFormulario.rolCasa_id,
        tipoDocumento_id: informacionFormulario?.tipoDocumento_id ? informacionFormulario?.tipoDocumento_id : 1,
        numeroDocumento: informacionFormulario.numeroDocumento ? informacionFormulario.numeroDocumento : '',
        terminos: false,
        direccion: informacionFormulario.direccion,
        ciudadDireccion: informacionFormulario.ciudadDireccion,
        paisDireccion: informacionFormulario.paisDireccion,
        codigoPostalDireccion: informacionFormulario?.codigoPostalDireccion,
        direccionPostal: informacionFormulario?.direccionPostal,
        ciudadPostal: informacionFormulario?.ciudadPostal,
        departamentoPostal: informacionFormulario?.departamentoPostal,
        codigoPostal: informacionFormulario?.codigoPostal,
        paisPostal: informacionFormulario?.paisPostal,
        departamentoDireccion: informacionFormulario?.departamentoDireccion,
        anoConocimiento: informacionFormulario?.anoConocimiento,
        idUsuarioQueRegistra: this.idUsuarioQueRegistra,
      };

      this.operacion.emit(usuarioNuevo);
    } else {
      Swal.fire({
        title: 'El usuario NO ha sido creado',
        icon: 'error',
        html: 'Existen campos obligatorios sin llenar',
      });
    }
  }

  copiarDireccionResidencia() {
    if (this.registroDosForm.get('mismaDireccionPostal').value) {
      const direccionResidencia = this.registroDosForm.get('direccion').value;
      this.registroDosForm.patchValue({
        direccionPostal: direccionResidencia,
        ciudadPostal: this.registroDosForm.get('ciudadDireccion').value,
        departamentoPostal: this.registroDosForm.get('departamentoDireccion').value,
        codigoPostal: this.registroDosForm.get('codigoPostalDireccion').value,
        paisPostal: this.registroDosForm.get('paisDireccion').value,
      });
    }
  }

  limpiarDireccionPostal() {
    if (!this.registroDosForm.get('mismaDireccionPostal').value) {
      this.registroDosForm.patchValue({
        direccionPostal: '',
        ciudadPostal: '',
        departamentoPostal: '',
        codigoPostal: '',
        paisPostal: '',
      });
    }
  }

  copiarFechaDeNacimiento() {
    if (this.registroCuatroForm.get('mismaFechaDeNacimiento').value) {
      let fecha = this.registroUnoForm.get('fechaNacimiento').value.substring(0, 4);
      this.registroCuatroForm.patchValue({
        anoConocimiento: fecha,
      });
    }
  }

  limpiarAnoConocimiento() {
    if (!this.registroCuatroForm.get('mismaFechaDeNacimiento').value) {
      this.registroCuatroForm.patchValue({
        anoConocimiento: this.anoConocimiento ? this.anoConocimiento : '',
      });
    }
  }

  ministeriosSeleccionados(): number[] {
    const ministeriosSeleccionados = this.registroCuatroForm.value.ministerio
      .map((checked: any, i: number) => (checked ? this.ministerios[i].id : null))
      .filter((value: any) => value !== null);
    return ministeriosSeleccionados;
  }

  deseleccionarMinisterios() {
    const ministeriosArray = this.registroCuatroForm.get('ministerio') as FormArray;
    ministeriosArray.controls.forEach((control) => {
      control.setValue(false);
    });
  }

  voluntariadosSelecionados(): number[] {
    const voluntariadosSelecionados = this.registroCuatroForm.value.voluntariado
      .map((checked: any, i: number) => (checked ? this.voluntariados[i].id : null))
      .filter((value: any) => value !== null);
    return voluntariadosSelecionados;
  }

  deseleccionarVoluntariados() {
    const voluntariadosArray = this.registroCuatroForm.get('voluntariado') as FormArray;
    voluntariadosArray.controls.forEach((control) => {
      control.setValue(false);
    });
  }

  filtrarCongregacionesPorPais(idPais: number | string) {
    this.camposFiltrados = null;

    this.congregacionesFiltradas = this.congregaciones?.filter(
      (congregacionBuscar) => congregacionBuscar.pais_id === Number(idPais)
    );
  }

  filtrarCamposPorCongregacion(idCongregacion: number | string) {
    this.camposFiltrados = this.campos.filter(
      (campoABuscar) => campoABuscar.congregacion_id === Number(idCongregacion)
    );
  }

  buscarNacionalidad(formControlName: string) {
    this.letrasFiltrarNacionalidad = this.registroDosForm.get(formControlName.toString()).valueChanges.pipe(
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

  buscarIDNacionalidad(nacionalidad: string): number {
    const nacionalidadEncontrada = this.nacionalidades.find(
      (nacionalidades) => nacionalidades.nombre.toLowerCase() === nacionalidad.toLowerCase()
    );

    if (nacionalidadEncontrada) {
      return nacionalidadEncontrada.id;
    } else {
      const controlNacionalidad = this.registroDosForm.get('nacionalidad');
      controlNacionalidad.setErrors({ incorrecto: true });

      return undefined;
    }
  }

  buscarCorreo(email: string) {
    this.mensajeBuscarCorreo = '';

    if (!email) {
      return;
    }
    this.buscarCorreoSubscription = this.buscarCorreoService
      .buscarCorreoUsuario(email, this.usuario?.id)
      .subscribe((respuesta: any) => {
        if (!respuesta.ok) {
          this.mensajeBuscarCorreo = respuesta.msg;
        }
      });
  }

  buscarCelular(): ValidatorFn {
    this.mensajeBuscarCelular = '';

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const numeroCelular = control.value;

      if (!numeroCelular) {
        return of(null);
      }

      const celularNumber = numeroCelular.internationalNumber;

      if (!celularNumber) {
        return of(null);
      }

      return this.buscarCelularService.buscarcelular(celularNumber, this.usuario?.id).pipe(
        map((respuesta: any) => {
          if (!respuesta.ok) {
            this.mensajeBuscarCelular = respuesta.msg;
            const error: ValidationErrors = { celularRegistrado: true, message: respuesta.msg };
            return error;
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }

  async tieneTipoDocumento(idPais: string = this.usuario?.usuarioCongregacionPais[0]?.id) {
    this.tipoDeDocumentosFiltrados = [];
    this.tipoDeDocumentosFiltrados = this.tiposDeDocumentos.filter(
      (tipoDocumento: TipoDocumentoModel) => tipoDocumento.pais_id === Number(idPais)
    );

    if (this.tipoDeDocumentosFiltrados.length > 0) {
      await this.agregarControlTipoDocumento();
    } else {
      this.eliminarControlTipoDocumento();
    }
  }

  async agregarControlTipoDocumento() {
    this.registroCuatroForm = this.formBuilder.group({
      ...this.registroCuatroForm.controls,
      tipoDocumento_id: [this.tipoDeDocumento, Validators.required],
      numeroDocumento: [this.numeroDocumento, Validators.required],
    });
    return true;
  }

  eliminarControlTipoDocumento() {
    this.registroCuatroForm?.removeControl('tipoDocumento_id');
    this.registroCuatroForm?.removeControl('numeroDocumento');

    return true;
  }

  onPaisChange(event: any = null) {
    // Obtener el valor del país seleccionado
    const paisSeleccionado = event ? event.target.value : this.usuario?.usuarioCongregacionPais[0]?.id;

    const idColombia = ID_PAIS.COLOMBIA;

    this.mostrarPoliticaDatos = paisSeleccionado == idColombia;

    // Si el país no es Colombia, desmarcar el checkbox y actualizar la validación
    if (!this.mostrarPoliticaDatos) {
      this.registroCuatroForm.get('aceptaPolitica').setValue(false);
      this.registroCuatroForm.get('aceptaPolitica').clearValidators();
      this.registroCuatroForm.get('aceptaPolitica').updateValueAndValidity();
    } else {
      this.registroCuatroForm.get('aceptaPolitica').setValidators(Validators.requiredTrue);
      this.registroCuatroForm.get('aceptaPolitica').updateValueAndValidity();
    }
  }

  next() {
    console.log(
      'Información del Censo',
      this.registroUnoForm,
      this.registroDosForm,
      this.registroTresForm,
      this.registroCuatroForm
    );
    if (this.step == 1) {
      this.registroUno_step = true;
      if (this.registroUnoForm.invalid) {
        return;
      }
      this.step++;
      return;
    }
    if (this.step == 2) {
      this.registroDos_step = true;
      if (this.registroDosForm.invalid) {
        return;
      }
      this.step++;
      return;
    }
    if (this.step == 3) {
      this.registroTres_step = true;
      if (this.registroTresForm.invalid) {
        return;
      }
      this.step++;
    }
  }

  previous() {
    this.step--;
    if (this.step == 1) {
      this.registroUno_step = false;
    }
    if (this.step == 2) {
      this.registroDos_step = false;
    }
    if (this.step == 3) {
      this.registroTres_step = false;
    }
  }

  cancelar() {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
  }
}
