import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RegisterFormInterface } from 'src/app/core/interfaces/register-form.interface';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { DosisModel } from 'src/app/core/models/dosis.model';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { FuenteIngresoModel } from 'src/app/core/models/fuente-ingreso.model';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { TipoEmpleoModel } from 'src/app/core/models/tipo-empleo.model';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { VacunaModel } from 'src/app/core/models/vacuna.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { Rutas } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
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

  public usuario: UsuarioModel;

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
  public tiposDeDocumentos: TipoDocumentoModel[] = [];

  public usuarioSeleccionado: UsuarioModel;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;

    // this.activatedRoute.params.subscribe(({ id }) => {
    //   this.buscarUsuario(id);
    // });

    this.usuarioSeleccionado = this.usuario;

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
        tipoDocumento: TipoDocumentoModel[];
        ministerio: MinisterioModel[];
        voluntariado: VoluntariadoModel[];
        pais: PaisModel[];
        campo: CampoModel[];
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
        this.ministerios = data.ministerio.filter((ministerio) => ministerio.estado === true);
        this.voluntariados = data.voluntariado;
        this.paises = data.pais.filter((pais) => pais.estado === true);
        this.campos = data.campo.filter((campo) => campo.estado === true);
        this.vacunas = data.vacuna;
        this.dosis = data.dosis;
        this.tiposDeDocumentos = data.tipoDocumento.filter((tipoDocumento) => tipoDocumento.estado === true);
      }
    );
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  buscarUsuario(id: string) {
    if (id !== 'nuevo') {
      this.usuarioService
        .getUsuario(Number(id))
        .pipe(delay(100))
        .subscribe(
          (usuarioEncontrado: UsuarioInterface) => {
            this.usuarioSeleccionado = usuarioEncontrado.usuario;
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Congregacion',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            return this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CONGREGACIONES}`);
          }
        );
    }
  }

  realizarOperacion(operacion: string, data: RegisterFormInterface) {
    if (operacion === 'actualizar') {
      this.actualizarPerfil(data);
    } else {
      this.crearUsuario(data);
    }
  }

  crearUsuario(usuarioNuevo: RegisterFormInterface) {
    this.usuarioService.crearUsuario(usuarioNuevo).subscribe(
      (usuarioCreado: any) => {
        Swal.fire('Usuario creado', 'correctamente', 'success');
        this.router.navigateByUrl(
          `${Rutas.SISTEMA}/${Rutas.CONFIRMAR_REGISTRO}/${usuarioCreado.usuarioNuevo.usuario.id}`
        );
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];
        if (!!errores) {
          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });
        }
        Swal.fire({
          title: 'El usuario NO ha sido creado',
          icon: 'error',
          html: listaErrores.join('') ? `${listaErrores.join('')}` : error.error.msg,
        });
      }
    );
  }

  actualizarPerfil(usuario: RegisterFormInterface) {
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
        this.usuarioService.actualizarUsuario(usuario, this.usuario.id).subscribe(
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
}
