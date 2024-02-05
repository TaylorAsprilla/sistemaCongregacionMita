import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { OPERACION, UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { TipoEmpleoModel } from 'src/app/core/models/tipo-empleo.model';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { RegisterFormInterface } from 'src/app/core/interfaces/register-form.interface';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss'],
})
export class RegistrarUsuarioComponent implements OnInit {
  public usuario: UsuarioModel;
  public generos: GeneroModel[] = [];
  public estadoCivil: EstadoCivilModel[] = [];
  public rolCasa: RolCasaModel[] = [];
  public paises: CongregacionPaisModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public campos: CampoModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];
  public gradosAcademicos: GradoAcademicoModel[] = [];
  public tiposEmpleos: TipoEmpleoModel[] = [];
  public tipoMiembros: TipoMiembroModel[] = [];
  public ministerios: MinisterioModel[] = [];
  public voluntariados: VoluntariadoModel[] = [];
  public tiposDeDocumentos: TipoDocumentoModel[] = [];

  get OPERACION() {
    return OPERACION;
  }

  constructor(private usuarioService: UsuarioService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data: {
        nacionalidad: NacionalidadModel[];
        estadoCivil: EstadoCivilModel[];
        rolCasa: RolCasaModel[];
        genero: GeneroModel[];
        gradoAcademico: GradoAcademicoModel[];
        tipoEmpleo: TipoEmpleoModel[];
        congregacion: CongregacionModel[];
        tipoMiembro: TipoMiembroModel[];
        tipoDocumento: TipoDocumentoModel[];
        ministerio: MinisterioModel[];
        voluntariado: VoluntariadoModel[];
        pais: CongregacionPaisModel[];
        campo: CampoModel[];
        usuario: UsuarioInterface;
      }) => {
        this.nacionalidades = data.nacionalidad;
        this.estadoCivil = data.estadoCivil;
        this.rolCasa = data.rolCasa;
        this.generos = data.genero.filter((genero) => genero.estado === true);

        this.gradosAcademicos = data.gradoAcademico;
        this.tiposEmpleos = data.tipoEmpleo;
        this.tipoMiembros = data.tipoMiembro;
        this.congregaciones = data.congregacion.filter((congregacion) => congregacion.estado === true);
        this.ministerios = data.ministerio.filter((ministerio) => ministerio.estado === true);
        this.voluntariados = data.voluntariado.filter((voluntariado) => voluntariado.estado === true);
        this.paises = data.pais.filter((pais) => pais.estado === true);
        this.campos = data.campo.filter((campo) => campo.estado === true);
        this.tiposDeDocumentos = data.tipoDocumento.filter((tipoDocumento) => tipoDocumento.estado === true);
        this.usuario = data?.usuario?.usuario;
      }
    );
  }

  arrayUsuarioData(dataType: string) {
    const data = this.usuario?.[dataType];
    return Array.isArray(data) ? data.map((item: any) => item?.id).filter(Boolean) : [];
  }

  realizarOperacion(operacion: string, data: RegisterFormInterface) {
    if (operacion === OPERACION.ACTUALIZAR_USUARIO) {
      this.actualizarPerfil(data);
    } else if (operacion === OPERACION.CREAR_USUARIO) {
      this.crearUsuario(data);
    }
  }

  crearUsuario(usuarioNuevo: RegisterFormInterface) {
    this.usuarioService.crearUsuario(usuarioNuevo).subscribe(
      (usuarioCreado: any) => {
        Swal.fire({
          title: 'Usuario creado',
          text: 'correctamente',
          icon: 'success',
        });

        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CONFIRMAR_REGISTRO}/${usuarioCreado.id}`);
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
            this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
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
