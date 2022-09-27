import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable, Subscription } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { DosisModel } from 'src/app/core/models/dosis.model';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { VacunaModel } from 'src/app/core/models/vacuna.model';
import { Rutas } from 'src/app/routes/menu-items';
import { CampoService } from 'src/app/services/campo/campo.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { DosisService } from 'src/app/services/dosis/dosis.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento/tipo-documento.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { VacunaService } from 'src/app/services/vacuna/vacuna.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FuenteIngresoModel } from 'src/app/core/models/fuente-ingreso.model';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { TipoEmpleoModel } from 'src/app/core/models/tipo-empleo.model';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss'],
})
export class RegistrarUsuarioComponent implements OnInit, OnDestroy {
  public usuarioForm: FormGroup;
  public registroUnoForm!: FormGroup;
  public registroDosForm!: FormGroup;
  public registroTresForm!: FormGroup;
  public registroCuatroForm!: FormGroup;

  public registroUno_step = false;
  public registroDos_step = false;
  public registroTres_step = false;
  public step: number = 1;

  currentDate = moment();

  public usuarios: UsuarioModel[] = [];
  public tipoDocumentos: TipoDocumentoModel[] = [];
  public generos: GeneroModel[] = [];
  public estadoCivil: EstadoCivilModel[] = [];
  public rolCasa: RolCasaModel[] = [];
  public paises: PaisModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public campos: CampoModel[] = [];
  public vacunas: VacunaModel[] = [];
  public dosis: DosisModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];
  public fuenteDeIngresos: FuenteIngresoModel[] = [];
  public gradosAcademicos: GradoAcademicoModel[] = [];
  public tiposEmpleos: TipoEmpleoModel[] = [];
  public tipoMiembros: TipoMiembroModel[] = [];
  public ministerios: MinisterioModel[] = [];
  public voluntariados: VoluntariadoModel[] = [];

  public congregacionesFiltradas: CongregacionModel[] = [];
  public camposFiltrados: CampoModel[] = [];

  public usuarioSeleccionado: UsuarioModel;

  // Subscription
  public usuarioSubscription: Subscription;

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
  // letrasFiltrarPaisResidencia: Observable

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarUsuario(id);
    });

    this.activatedRoute.data.subscribe(
      (data: {
        nacionalidad: NacionalidadModel[];
        estadoCivil: EstadoCivilModel[];
        rolCasa: RolCasaModel[];
        genero: GeneroModel[];
        fuenteDeIngreso: FuenteIngresoModel[];
        gradoAcademico: GradoAcademicoModel[];
        tipoEmpleo: TipoEmpleoModel[];
        congregacion: CongregacionModel[];
        tipoMiembro: TipoMiembroModel[];
        ministerio: MinisterioModel[];
        voluntariado: VoluntariadoModel[];
        pais: PaisModel[];
        campo: CampoModel[];
        tipoDocumento: TipoDocumentoModel[];
        vacuna: VacunaModel[];
        dosis: DosisModel[];
      }) => {
        this.nacionalidades = data.nacionalidad;
        this.estadoCivil = data.estadoCivil;
        this.rolCasa = data.rolCasa;
        this.generos = data.genero;
        this.fuenteDeIngresos = data.fuenteDeIngreso;
        this.gradosAcademicos = data.gradoAcademico;
        this.tiposEmpleos = data.tipoEmpleo;
        this.tipoMiembros = data.tipoMiembro;
        this.congregaciones = data.congregacion.filter((congregacion) => congregacion.estado === true);
        this.ministerios = data.ministerio;
        this.voluntariados = data.voluntariado;
        this.paises = data.pais.filter((pais) => pais.estado === true);
        this.campos = data.campo.filter((campo) => campo.estado === true);
        this.vacunas = data.vacuna;
        this.dosis = data.dosis;
      }
    );

    this.registroUnoForm = this.formBuilder.group({
      fechaNacimiento: ['2022-07-27', [Validators.required]],
      primerNombre: ['Taylor', [Validators.required, Validators.minLength(3)]],
      segundoNombre: ['Alirio', [Validators.minLength(3)]],
      primerApellido: ['Asprilla', [Validators.required, Validators.minLength(3)]],
      segundoApellido: ['Bohórquez', [Validators.minLength(3)]],
      apodo: ['Tay', [Validators.minLength(3)]],
      email: ['taylor.asprilla@gmail.com', [Validators.email]],
      genero_id: ['1', [Validators.required]],
      estadoCivil_id: ['1', [Validators.required]],
    });

    this.registroDosForm = this.formBuilder.group({
      nacionalidad: ['Colombia', [Validators.required]],
      rolCasa_id: ['1', [Validators.required]],
      numeroCelular: ['+573118873332', [Validators.required]],
      telefonoCasa: ['+17879343120', []],
      direccionResidencia: ['Calle 12 # 17 - 34', [Validators.required, Validators.minLength(5)]],
      ciudadResidencia: ['Bogotá', [Validators.required, Validators.minLength(5)]],
      departamentoResidencia: ['Cundinamarca', [Validators.minLength(5)]],
      codigoPostalResidencia: ['100123', [Validators.minLength(3)]],
      paisResidencia: ['Puerto Rico', [Validators.required]],
      direccionPostal: ['Calle 12 # 17 - 34', [Validators.required, Validators.minLength(5)]],
      ciudadPostal: ['Bogotá', [Validators.required, Validators.minLength(5)]],
      departamentoPostal: ['Cundinamarca', [Validators.minLength(5)]],
      codigoPostal: ['12300', [Validators.minLength(3)]],
      paisPostal: ['Colombia', [Validators.required]],
    });

    this.registroTresForm = this.formBuilder.group({
      fuenteIngresos: ['1', [Validators.required]],
      ingresoMensual: ['1250000', []],
      gradoAcademico_id: ['2', []],
      tipoEmpleo_id: ['2', []],
      especializacionEmpleo: ['Ingeniero', []],
    });

    this.registroCuatroForm = this.formBuilder.group({
      tipoMiembro_id: ['2', []],
      congregacion_id: ['1', [Validators.required]],
      campo_id: ['1', [Validators.required]],
      esJoven: ['1', [Validators.required]],
      ejerceMinisterio: ['1', [Validators.required]],
      esVoluntario: ['1', [Validators.required]],
      ministerio: ['2', []],
      voluntariado: ['11', []],
      pais_id: ['', [Validators.required]],
      tipoDocumento_id: ['', [Validators.required]],
      vacuna_id: ['', [Validators.required]],
      dosis_id: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required]],
    });

    this.usuarioSubscription = this.usuarioService.listarTodosLosUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.usuarios = usuarios;
    });
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  guardarUsuario() {
    const usuarioNuevo = this.usuarioForm.value;

    this.usuarioService.crearUsuario(usuarioNuevo).subscribe(
      (usuarioCreado: any) => {
        Swal.fire('Usuario creado', 'correctamente', 'success');
        this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.USUARIOS}`);
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Usuario creado',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
      }
    );
  }

  buscarUsuario(id: string) {
    if (id !== 'nuevo') {
      this.usuarioService
        .getUsuario(Number(id))
        .pipe(delay(100))
        .subscribe(
          (usuarioEncontrado: UsuarioInterface) => {
            console.info(usuarioEncontrado);
            const {
              primerNombre,
              primerApellido,
              email,
              numeroCelular,
              fechaNacimiento,
              genero_id,
              estadoCivil_id,
              vacuna_id,
              dosis_id,
              segundoNombre,
              segundoApellido,
              numeroDocumento,
              telefonoCasa,

              login,
              password,
              foto,
              tipoDocumento_id,
              rolCasa_id,
              nacionalidad_id,
            } = usuarioEncontrado.usuario;
            this.usuarioSeleccionado = usuarioEncontrado.usuario;

            const { pais_id, congregacion_id, campo_id } = usuarioEncontrado.usuarioCongregacion;

            this.usuarioForm.setValue({
              primerNombre,
              primerApellido,
              email,
              numeroCelular,
              fechaNacimiento,
              genero_id,
              pais_id,
              congregacion_id,
              campo_id,
              estadoCivil_id,
              vacuna_id,
              dosis_id,
              segundoNombre,
              segundoApellido,
              numeroDocumento,
              telefonoCasa,

              login,
              password,
              foto,
              tipoDocumento_id,
              rolCasa_id,
              nacionalidad_id,
            });
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Usuario',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            return this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.USUARIOS}`);
          }
        );
    }
  }

  resetFormulario() {
    this.usuarioForm.reset();
  }

  listarCongregaciones(pais: string) {
    this.congregacionesFiltradas = this.congregaciones.filter(
      (congregacionBuscar) => congregacionBuscar.pais_id === parseInt(pais)
    );
  }

  listarCampos(congregacion: string) {
    this.camposFiltrados = this.campos.filter(
      (campoABuscar) => campoABuscar.congregacion_id === parseInt(congregacion)
    );
  }

  buscarNacionalidad(formControlName: string) {
    console.log('Ingresa...');
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
      console.log('Información formulario', this.registroDosForm);
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
