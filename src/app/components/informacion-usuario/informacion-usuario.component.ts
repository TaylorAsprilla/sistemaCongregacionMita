import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RegisterFormInterface } from 'src/app/core/interfaces/register-form.interface';
import { CampoModel, CONGREGACION_CAMPO } from 'src/app/core/models/campo.model';
import { CONGREGACION, CongregacionModel } from 'src/app/core/models/congregacion.model';
import { DosisModel } from 'src/app/core/models/dosis.model';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { FuenteIngresoModel } from 'src/app/core/models/fuente-ingreso.model';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { CongregacionPaisModel, CONGREGACION_PAIS } from 'src/app/core/models/congregacion-pais.model';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { TipoDocumentoModel, TIPO_DOCUMENTO_ID } from 'src/app/core/models/tipo-documento.model';
import { TipoEmpleoModel } from 'src/app/core/models/tipo-empleo.model';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { VacunaModel } from 'src/app/core/models/vacuna.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { BuscarCorreoService } from 'src/app/services/buscar-correo/buscar-correo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informacion-usuario',
  templateUrl: './informacion-usuario.component.html',
  styleUrls: ['./informacion-usuario.component.scss'],
})
export class InformacionUsuarioComponent implements OnInit {
  public registroUnoForm!: FormGroup;
  public registroDosForm!: FormGroup;
  public registroTresForm!: FormGroup;
  public registroCuatroForm!: FormGroup;

  public registroUno_step = false;
  public registroDos_step = false;
  public registroTres_step = false;
  public step: number = 1;

  @Input() public usuario: UsuarioModel;
  @Input() public usuarios: UsuarioModel[] = [];
  @Input() public generos: GeneroModel[] = [];
  @Input() public estadoCivil: EstadoCivilModel[] = [];
  @Input() public rolCasa: RolCasaModel[] = [];
  @Input() public paises: CongregacionPaisModel[] = [];
  @Input() public congregaciones: CongregacionModel[] = [];
  @Input() public campos: CampoModel[] = [];
  @Input() public vacunas: VacunaModel[] = [];
  @Input() public dosis: DosisModel[] = [];
  @Input() public nacionalidades: NacionalidadModel[] = [];
  @Input() public fuenteDeIngresos: FuenteIngresoModel[] = [];
  @Input() public gradosAcademicos: GradoAcademicoModel[] = [];
  @Input() public tiposEmpleos: TipoEmpleoModel[] = [];
  @Input() public tipoMiembros: TipoMiembroModel[] = [];
  @Input() public ministerios: MinisterioModel[] = [];
  @Input() public voluntariados: VoluntariadoModel[] = [];
  @Input() public tiposDeDocumentos: TipoDocumentoModel[] = [];
  @Input() public tipoDeDocumentosFiltrados: TipoDocumentoModel[] = [];
  @Input() public usuarioMinisterios: number[] = [];
  @Input() public usuarioVoluntariados: number[] = [];
  @Input() public usuarioFuenteDeIngresos: number[] = [];

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

  @Output() usuarioNuevo = new EventEmitter<RegisterFormInterface>();

  letrasFiltrarNacionalidad: Observable<NacionalidadModel[]>;

  public usuarioSeleccionado: UsuarioModel;
  public congregacionesFiltradas: CongregacionModel[] = [];
  public camposFiltrados: CampoModel[] = [];

  public mensajeBuscarCorreo: string = '';
  public sinCongregacion: number;
  public sinCampo: number;

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
  fuentedeIngresoUsuario: number[];
  ingresoMensual: string;
  gradoAcademico: number;
  tipoEmpleo: number;
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
  vacuna: number;
  dosisUsuario: number;
  tipoDeDocumento: string;
  numeroDocumento: string;

  // Subscription
  public usuarioSubscription: Subscription;
  public buscarCorreoSubscription: Subscription;
  public buscarCelularSubscription: Subscription;

  get CONGREGACION_CAMPO() {
    return CONGREGACION_CAMPO;
  }

  get CONGREGACION() {
    return CONGREGACION;
  }

  get CONGREGACION_PAIS() {
    return CONGREGACION_PAIS;
  }

  constructor(private formBuilder: FormBuilder, private buscarCorreoService: BuscarCorreoService) {}

  ngOnInit(): void {
    this.listarCongregaciones();
    this.listarCampos();
    this.informacionDelUsuario();
    this.crearFormularios();
    this.tieneTipoDocumento();
  }

  informacionDelUsuario() {
    this.fechaDeNacimiento = this.usuario?.fechaNacimiento ? this.usuario.fechaNacimiento : null;
    this.primerNombre = this.usuario?.primerNombre ? this.usuario.primerNombre : '';
    this.segundoNombre = this.usuario?.segundoNombre ? this.usuario.segundoNombre : '';
    this.primerApellido = this.usuario?.primerApellido ? this.usuario.primerApellido : '';
    this.segundoApellio = this.usuario?.segundoApellido ? this.usuario.segundoApellido : '';
    this.apodo = this.usuario?.apodo ? this.usuario.apodo : '';
    this.email = this.usuario?.email ? this.usuario.email : '';
    this.genero_id = this.usuario?.genero_id ? this.usuario.genero_id : null;
    this.estadoCivil_id = this.usuario?.estadoCivil_id ? this.usuario.estadoCivil_id : null;
    this.nacionalidad = this.usuario?.nacionalidad?.nombre ? this.usuario.nacionalidad?.nombre : '';
    this.rolEnCasa = this.usuario?.rolCasa_id ? this.usuario.rolCasa_id : null;
    this.celular = this.usuario?.numeroCelular ? this.usuario.numeroCelular : '';
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
    this.fuentedeIngresoUsuario = this.usuarioFuenteDeIngresos ? this.usuarioFuenteDeIngresos : null;
    this.ingresoMensual = this.usuario?.ingresoMensual ? this.usuario.ingresoMensual : '';
    this.gradoAcademico = this.usuario?.gradoAcademico_id ? this.usuario.gradoAcademico_id : null;
    this.tipoEmpleo = this.usuario?.tipoEmpleo_id ? this.usuario.tipoEmpleo_id : null;
    this.especializacionEmpleo = this.usuario?.especializacionEmpleo ? this.usuario.especializacionEmpleo : null;
    this.tipoMiembro = this.usuario?.tipoMiembro_id ? this.usuario.tipoMiembro_id : null;
    this.esjoven = this.usuario?.esJoven ? 1 : 0;
    this.ejerMinisterio = this.usuario?.usuarioMinisterio ? true : false;
    this.voluntario = this.usuario?.usuarioVoluntariado ? true : false;
    this.ministerioUsuario = this.usuarioMinisterios ? this.usuarioMinisterios : null;
    this.voluntarioUsuario = this.usuarioVoluntariados ? this.usuarioVoluntariados : null;
    this.congregacionPais = this.usuario?.usuarioCongregacion[0]?.UsuarioCongregacion?.pais_id
      ? this.usuario?.usuarioCongregacion[0]?.UsuarioCongregacion?.pais_id
      : null;
    this.congreacionCiudad = this.usuario?.usuarioCongregacion[0]?.UsuarioCongregacion?.congregacion_id
      ? this.usuario?.usuarioCongregacion[0]?.UsuarioCongregacion?.congregacion_id
      : null;
    this.congregacionCampo = this.usuario?.usuarioCongregacion[0]?.UsuarioCongregacion?.campo_id
      ? this.usuario?.usuarioCongregacion[0]?.UsuarioCongregacion?.campo_id
      : null;

    this.tipoDeDocumento = this.usuario?.tipoDocumento_id
      ? this.usuario.tipoDocumento_id.toString()
      : TIPO_DOCUMENTO_ID.SIN_DOCUMENTO;

    this.numeroDocumento = this.usuario?.numeroDocumento ? this.usuario?.numeroDocumento : '';

    this.vacuna = this.usuario?.vacuna_id ? this.usuario?.vacuna_id : null;
    this.dosisUsuario = this.usuario?.dosis_id ? this.usuario?.dosis_id : null;
  }

  crearFormularios() {
    const controlMinisterios = this.ministerios.map((control) => this.formBuilder.control(false));
    const controlVoluntariados = this.voluntariados.map((control) => this.formBuilder.control(false));
    const controlFuenteDeIngresos = this.fuenteDeIngresos.map((control) => this.formBuilder.control(false));

    this.registroUnoForm = this.formBuilder.group({
      fechaNacimiento: [this.fechaDeNacimiento, [Validators.required]],
      primerNombre: [this.primerNombre, [Validators.required, Validators.minLength(3)]],
      segundoNombre: [this.segundoNombre, [Validators.minLength(3)]],
      primerApellido: [this.primerApellido, [Validators.required, Validators.minLength(3)]],
      segundoApellido: [this.segundoApellio, [Validators.minLength(3)]],
      apodo: [this.apodo, [Validators.minLength(3)]],
      email: [this.email, [Validators.required, Validators.email]],
      genero_id: [this.genero_id, [Validators.required]],
      estadoCivil_id: [this.estadoCivil_id, [Validators.required]],
    });

    this.registroDosForm = this.formBuilder.group({
      nacionalidad: [this.nacionalidad, [Validators.required, Validators.minLength(3)]],
      rolCasa_id: [this.rolEnCasa, [Validators.required]],
      numeroCelular: [this.celular, [Validators.required, Validators.minLength(3)]],
      telefonoCasa: [this.telefonoCasa, [Validators.minLength(3)]],
      direccionResidencia: [this.direccion, [Validators.required, Validators.minLength(3)]],
      ciudadResidencia: [this.ciudadDireccion, [Validators.required, Validators.minLength(3)]],
      departamentoResidencia: [this.departamentoDireccion, [Validators.minLength(3)]],
      codigoPostalResidencia: [this.codigoPostalDireccion, [Validators.minLength(3)]],
      paisResidencia: [this.paisDireccion, [Validators.required, Validators.minLength(3)]],
      direccionPostal: [this.direccionPostal, [Validators.minLength(5)]],
      ciudadPostal: [this.ciudadPostal, [Validators.minLength(3)]],
      departamentoPostal: [this.departamentoPostal, [Validators.minLength(3)]],
      codigoPostal: [this.codigoPostal, [Validators.minLength(3)]],
      paisPostal: [this.paisPostal, [Validators.minLength(3)]],
    });

    this.registroTresForm = this.formBuilder.group({
      fuenteIngresos: this.formBuilder.array(controlFuenteDeIngresos),
      ingresoMensual: [this.ingresoMensual, [Validators.minLength(3)]],
      gradoAcademico_id: [this.gradoAcademico, [Validators.required]],
      tipoEmpleo_id: [this.tipoEmpleo, [Validators.required]],
      especializacionEmpleo: [this.especializacionEmpleo, [Validators.minLength(3)]],
    });

    this.registroCuatroForm = this.formBuilder.group({
      tipoMiembro_id: [this.tipoMiembro, [Validators.required]],
      congregacionPais_id: [this.congregacionPais, [Validators.required]],
      congregacion_id: [this.congreacionCiudad, [Validators.required]],
      campo_id: [this.congregacionCampo, [Validators.required]],
      esJoven: [this.esjoven, [Validators.required]],
      ejerceMinisterio: [this.ejerMinisterio, [Validators.required]],
      esVoluntario: [this.voluntario, [Validators.required]],
      ministerio: this.formBuilder.array(controlMinisterios),
      voluntariado: this.formBuilder.array(controlVoluntariados),
      vacuna_id: [this.vacuna, [Validators.required]],
      dosis_id: [this.dosisUsuario, [Validators.required]],
    });

    this.patchValueMinisterios();
    this.patchValueVoluntariados();
    this.patchValueFuenteDeIngresos();
  }

  get fuenteDeIngresosArr() {
    return this.registroTresForm.get('fuenteIngresos') as FormArray;
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

  patchValueFuenteDeIngresos() {
    this.fuenteDeIngresos.map((fuenteDeIngreso: FuenteIngresoModel, i: number) => {
      if (this.fuentedeIngresoUsuario?.indexOf(fuenteDeIngreso.id) !== -1) {
        this.fuenteDeIngresosArr.at(i)?.patchValue(true);
      }
    });
  }

  onCheckboxFuenteDeIngresosChange(event: any) {
    const selectedFuenteDeIngresos = this.registroTresForm.controls['fuenteIngresos'] as FormArray;

    if (event.target.checked) {
      selectedFuenteDeIngresos.push(new FormControl(event.target.value));
    } else {
      const index = selectedFuenteDeIngresos.controls.findIndex((x) => x.value === event.target.value);
      selectedFuenteDeIngresos.removeAt(index);
    }
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
    this.registroCuatroForm;

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

      const usuarioNuevo: RegisterFormInterface = {
        primerNombre: informacionFormulario?.primerNombre,
        segundoNombre: informacionFormulario.segundoNombre ? informacionFormulario.segundoNombre : '',
        primerApellido: informacionFormulario?.primerApellido,
        segundoApellido: informacionFormulario.segundoApellido ? informacionFormulario.segundoApellido : '',
        apodo: informacionFormulario.apodo ? informacionFormulario.apodo : '',
        nacionalidad_id: this.buscarIDNacionalidad(informacionFormulario.nacionalidad),
        email: informacionFormulario.email ? informacionFormulario.email : '',
        numeroCelular: informacionFormulario.numeroCelular?.internationalNumber,
        telefonoCasa: informacionFormulario.telefonoCasa?.internationalNumber,
        fechaNacimiento: informacionFormulario?.fechaNacimiento,
        genero_id: informacionFormulario?.genero_id,
        estadoCivil_id: informacionFormulario?.estadoCivil_id,
        vacuna_id: informacionFormulario?.vacuna_id,
        dosis_id: informacionFormulario?.dosis_id,

        fuentesDeIngreso: this.fuenteDeIngresosSelecionados(),
        ingresoMensual: informacionFormulario.ingresoMensual,
        gradoAcademico_id: informacionFormulario.gradoAcademico_id,
        tipoEmpleo_id: informacionFormulario.tipoEmpleo_id,
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
        direccion: informacionFormulario.direccionResidencia,
        ciudadDireccion: informacionFormulario.ciudadResidencia,
        paisDireccion: informacionFormulario.paisResidencia,
        codigoPostalDireccion: informacionFormulario.codigoPostalResidencia,
        direccionPostal: informacionFormulario.direccionPostal,
        ciudadPostal: informacionFormulario.ciudadPostal,
        departamentoPostal: informacionFormulario.departamentoPostal,
        codigoPostal: informacionFormulario.codigoPostal,
        paisPostal: informacionFormulario.paisPostal,
        departamentoDireccion: informacionFormulario.departamentoDireccion,
      };
      this.usuarioNuevo.emit(usuarioNuevo);
    } else {
      Swal.fire({
        title: 'El usuario NO ha sido creado',
        icon: 'error',
        html: 'Existen campos obligatorios sin llenar',
      });
    }
  }

  ministeriosSeleccionados(): number[] {
    const ministeriosSeleccionados = this.registroCuatroForm.value.ministerio
      .map((checked: any, i: number) => (checked ? this.ministerios[i].id : null))
      .filter((value: any) => value !== null);
    return ministeriosSeleccionados;
  }

  fuenteDeIngresosSelecionados(): number[] {
    const fuenteDeIngresosSelecionados = this.registroTresForm.value.fuenteIngresos
      .map((checked: any, i: number) => (checked ? this.fuenteDeIngresos[i].id : null))
      .filter((value: any) => value !== null);
    return fuenteDeIngresosSelecionados;
  }

  voluntariadosSelecionados(): number[] {
    const voluntariadosSelecionados = this.registroCuatroForm.value.voluntariado
      .map((checked: any, i: number) => (checked ? this.voluntariados[i].id : null))
      .filter((value: any) => value !== null);
    return voluntariadosSelecionados;
  }

  listarCongregaciones(pais: string = this.usuario?.paisId) {
    this.congregacionesFiltradas = this.congregaciones?.filter(
      (congregacionBuscar) => congregacionBuscar.pais_id === parseInt(pais)
    );
  }

  listarCampos(congregacion: string = this.usuario?.congregacionId) {
    this.camposFiltrados = this.campos.filter(
      (campoABuscar) => campoABuscar.congregacion_id === parseInt(congregacion)
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
    return this.nacionalidades.find((nacionalidades: NacionalidadModel) => nacionalidades.nombre == nacionalidad).id;
  }

  buscarCorreo(email) {
    this.mensajeBuscarCorreo = '';
    this.buscarCorreoSubscription = this.buscarCorreoService.buscarCorreoUsuario(email).subscribe((respuesta: any) => {
      if (!respuesta.ok) {
        this.mensajeBuscarCorreo = respuesta.msg;
      }
    });
  }

  tieneTipoDocumento(idPais: string = this.usuario?.paisId) {
    this.tipoDeDocumentosFiltrados = [];
    this.tipoDeDocumentosFiltrados = this.tiposDeDocumentos.filter(
      (tipoDocumento: TipoDocumentoModel) => tipoDocumento.pais_id === Number(idPais)
    );

    if (this.tipoDeDocumentosFiltrados.length > 0) {
      this.agregarControlTipoDocumento();
    } else {
      this.eliminarControlTipoDocumento();
    }
  }

  agregarControlTipoDocumento() {
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

  next() {
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
}
