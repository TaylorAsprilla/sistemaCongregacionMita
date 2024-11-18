import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterFormInterface } from 'src/app/core/interfaces/register-form.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { OPERACION, UsuarioModel } from 'src/app/core/models/usuario.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit, OnDestroy {
  public usuario: UsuarioModel;
  public generos: GeneroModel[] = [];
  public estadoCivil: EstadoCivilModel[] = [];
  public rolCasa: RolCasaModel[] = [];
  public paises: CongregacionPaisModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public campos: CampoModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];
  public gradosAcademicos: GradoAcademicoModel[] = [];
  public tipoMiembros: TipoMiembroModel[] = [];
  public ministerios: MinisterioModel[] = [];
  public voluntariados: VoluntariadoModel[] = [];
  public tiposDeDocumentos: TipoDocumentoModel[] = [];

  //Subscription
  public usuarioSubscription: Subscription;

  get OPERACION() {
    return OPERACION;
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService) {}

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
        this.generos = data.genero;
        this.gradosAcademicos = data.gradoAcademico;
        this.tipoMiembros = data.tipoMiembro;
        this.congregaciones = data.congregacion.filter(
          (congregacion: CongregacionModel) => congregacion.estado === true
        );
        this.ministerios = data.ministerio.filter((ministerio: MinisterioModel) => ministerio.estado === true);
        this.voluntariados = data.voluntariado;
        this.paises = data.pais.filter((pais: CongregacionPaisModel) => pais.estado === true);
        this.campos = data.campo.filter((campo: CampoModel) => campo.estado === true);
        this.tiposDeDocumentos = data.tipoDocumento.filter(
          (tipoDocumento: TipoDocumentoModel) => tipoDocumento.estado === true
        );
        this.usuario = data.usuario.usuario;
      }
    );
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  realizarOperacion(operacion: string, data: RegisterFormInterface) {
    if (operacion === OPERACION.ACTUALIZAR_USUARIO) {
      this.actualizarPerfil(data);
    }
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
            let listaErrores: string[] = [];

            Object.entries(errores).forEach(([key, value]) => {
              if (value && typeof value === 'object' && 'msg' in value) {
                listaErrores.push(`° ${value['msg']}<br>`);
              }
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

  arrayUsuarioData(dataType: keyof UsuarioModel): number[] {
    // Verificamos si 'dataType' existe en 'usuario' y es un arreglo
    const data = this.usuario[dataType];

    // Si 'data' es un arreglo, mapeamos los ids y filtramos los valores no válidos
    if (Array.isArray(data)) {
      return data.map((item: any) => item?.id).filter(Boolean);
    }

    // Si no es un arreglo o no existe, devolvemos un arreglo vacío
    return [];
  }
}
