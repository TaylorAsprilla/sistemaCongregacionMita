import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
import { EstadoCivilService } from 'src/app/services/estado-civil/estado-civil.service';
import { GeneroService } from 'src/app/services/genero/genero.service';
import { NacionalidadService } from 'src/app/services/nacionalidad/nacionalidad.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { RolCasaService } from 'src/app/services/rol-casa/rol-casa.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento/tipo-documento.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { VacunaService } from 'src/app/services/vacuna/vacuna.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit, OnDestroy {
  isEdit: boolean = false;

  //Subscription
  public usuarioSubscription: Subscription;
  public tipoDocumentoSubscription: Subscription;
  public generoSubscription: Subscription;
  public estadoCivilSubscription: Subscription;
  public rolCasaSubscription: Subscription;
  public paisSubscription: Subscription;
  public congregacionSubscription: Subscription;
  public campoSubscription: Subscription;
  public vacunaSubscription: Subscription;
  public dosisSubscription: Subscription;
  public nacionalidadSubscription: Subscription;

  public perfilForm: UntypedFormGroup;
  public usuario: UsuarioModel;
  public tipoDocumentos: TipoDocumentoModel[];
  public usuarios: UsuarioModel[] = [];
  public generos: GeneroModel[] = [];
  public estadoCivil: EstadoCivilModel[] = [];
  public rolCasa: RolCasaModel[] = [];
  public paises: PaisModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public campos: CampoModel[] = [];
  public vacunas: VacunaModel[] = [];
  public dosis: DosisModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private tipoDocumentoService: TipoDocumentoService,
    private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService,
    private rolCasaService: RolCasaService,
    private paisService: PaisService,
    private congregacionService: CongregacionService,
    private campoService: CampoService,
    private vacunaService: VacunaService,
    private dosisService: DosisService,
    private nacionalidadServices: NacionalidadService
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;

    this.perfilForm = this.formBuilder.group({
      primerNombre: [this.usuario?.primerNombre, [Validators.required, Validators.minLength(3)]],
      segundoNombre: [this.usuario?.segundoNombre, [Validators.minLength(3)]],
      primerApellido: [this.usuario?.primerApellido, [Validators.required, Validators.minLength(3)]],
      segundoApellido: [this.usuario?.segundoApellido, [Validators.minLength(3)]],
      numeroDocumento: [this.usuario?.numeroDocumento],
      nacionalidad_id: [this.usuario?.nacionalidad_id, [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: [this.usuario?.fechaNacimiento, [Validators.required]],
      email: [this.usuario?.email, [Validators.required, Validators.email]],
      numeroCelular: [this.usuario?.numeroCelular, [Validators.minLength(3)]],
      telefonoCasa: [this.usuario?.telefonoCasa, [Validators.minLength(3)]],
      login: [this.usuario?.login, []],
      password: ['', [Validators.required]],
      foto: [this.usuario?.fotoUrl, []],
      genero_id: [this.usuario?.genero_id, [Validators.required]],
      tipoDocumento_id: [this.usuario?.tipoDocumento_id, [Validators.required]],
      estadoCivil_id: [this.usuario?.estadoCivil_id, [Validators.required]],
      rolCasa_id: [this.usuario?.rolCasa_id, [Validators.required]],
      pais_id: ['', [Validators.required]],
      congregacion_id: ['', [Validators.required]],
      campo_id: ['', [Validators.required]],
      vacuna_id: [this.usuario?.vacuna_id, [Validators.required]],
      dosis_id: [this.usuario?.dosis_id, [Validators.required]],
    });

    this.tipoDocumentoSubscription = this.tipoDocumentoService
      .listarTipoDocumentos()
      .subscribe((tipoDocumento: TipoDocumentoModel[]) => {
        this.tipoDocumentos = tipoDocumento.filter(
          (tipoDocumento: TipoDocumentoModel) => tipoDocumento.estado === true
        );
      });

    this.usuarioSubscription = this.usuarioService.listarTodosLosUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.usuarios = usuarios;
    });

    this.tipoDocumentoSubscription = this.tipoDocumentoService
      .listarTipoDocumentos()
      .subscribe((tipoDocumento: TipoDocumentoModel[]) => {
        this.tipoDocumentos = tipoDocumento;
      });

    this.generoSubscription = this.generoService.getGeneros().subscribe((genero: GeneroModel[]) => {
      this.generos = genero;
    });

    this.estadoCivilSubscription = this.estadoCivilService
      .getEstadoCivil()
      .subscribe((estadoCivil: EstadoCivilModel[]) => {
        this.estadoCivil = estadoCivil;
      });

    this.rolCasaSubscription = this.rolCasaService.getRolCasa().subscribe((rolCasa: RolCasaModel[]) => {
      this.rolCasa = rolCasa;
    });

    this.paisSubscription = this.paisService.getPaises().subscribe((pais: PaisModel[]) => {
      this.paises = pais;
    });

    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .subscribe((congregacion: CongregacionModel[]) => {
        this.congregaciones = congregacion;
      });

    this.campoSubscription = this.campoService.getCampos().subscribe((campo: CampoModel[]) => {
      this.campos = campo;
    });

    this.vacunaSubscription = this.vacunaService.getVacunas().subscribe((vacuna: VacunaModel[]) => {
      this.vacunas = vacuna;
    });

    this.dosisSubscription = this.dosisService.getDosis().subscribe((dosis: DosisModel[]) => {
      this.dosis = dosis;
    });

    this.nacionalidadSubscription = this.nacionalidadServices
      .getNacionalidades()
      .subscribe((nacionalidad: NacionalidadModel[]) => {
        this.nacionalidades = nacionalidad;
      });
  }

  ngOnDestroy(): void {
    this.tipoDocumentoSubscription?.unsubscribe();
    this.usuarioSubscription?.unsubscribe();
    this.tipoDocumentoSubscription?.unsubscribe();
    this.generoSubscription?.unsubscribe();
    this.estadoCivilSubscription?.unsubscribe();
    this.rolCasaSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
    this.congregacionSubscription?.unsubscribe();
    this.campoSubscription?.unsubscribe();
    this.vacunaSubscription?.unsubscribe();
    this.dosisSubscription?.unsubscribe();
  }

  habilitarFormulario() {
    this.perfilForm.enable();
  }

  actualizarPerfil() {
    Swal.fire({
      title: 'Actualizar Perfil',
      text: '¿Desea actualizar la información de su perfil?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.actualizarUsuario(this.perfilForm.value, this.usuario.id).subscribe(
          (usuarioActualizado) => {
            Swal.fire('Actualizado', 'Los datos del perfil se actualizaron', 'success');
            this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.INICIO}`);
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Error',
              icon: 'error',
              html: `Error al actualizar el perfil <p> ${listaErrores.join('')}`,
            });
          }
        );
      }
    });
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  submit() {
    this.toggleEdit();
  }
}
