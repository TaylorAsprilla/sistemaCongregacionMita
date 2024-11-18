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
  usuario: UsuarioModel;
  generos: GeneroModel[] = [];
  estadoCivil: EstadoCivilModel[] = [];
  rolCasa: RolCasaModel[] = [];
  paises: CongregacionPaisModel[] = [];
  congregaciones: CongregacionModel[] = [];
  campos: CampoModel[] = [];
  nacionalidades: NacionalidadModel[] = [];
  gradosAcademicos: GradoAcademicoModel[] = [];

  tipoMiembros: TipoMiembroModel[] = [];
  ministerios: MinisterioModel[] = [];
  voluntariados: VoluntariadoModel[] = [];
  tiposDeDocumentos: TipoDocumentoModel[] = [];
  idUsuarioQueRegistra: number;

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
        this.tipoMiembros = data.tipoMiembro;
        this.congregaciones = data.congregacion.filter((congregacion) => congregacion.estado === true);
        this.ministerios = data.ministerio.filter((ministerio) => ministerio.estado === true);
        this.voluntariados = data.voluntariado.filter((voluntariado) => voluntariado.estado === true);
        this.paises = data.pais.filter((pais) => pais.estado === true);
        this.campos = data.campo.filter((campo) => campo.estado === true);
        this.tiposDeDocumentos = data.tipoDocumento.filter((tipoDocumento) => tipoDocumento.estado === true);
        this.usuario = data.usuario?.usuario;
      }
    );
    this.idUsuarioQueRegistra = this.usuarioService.usuarioId ?? 0;
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
        const errores = error.error.errors;
        const listaErrores: string[] = [];
        if (errores) {
          Object.entries(errores).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && 'msg' in value) {
              listaErrores.push('° ' + (value as { msg: string }).msg + '<br>');
            }
          });
        }
        Swal.fire({
          title: 'El usuario NO ha sido creado',
          icon: 'error',
          html: listaErrores.length ? listaErrores.join('') : error.error.msg,
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
            const errores = error.error.errors;
            const listaErrores: string[] = [];

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
