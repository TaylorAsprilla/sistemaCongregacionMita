import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { CategoriaProfesionModel } from 'src/app/core/models/categoria-profesion.model';
import { InformacionUsuarioComponent } from '../../components/informacion-usuario/informacion-usuario.component';
import { PerfilData } from 'src/app/resolvers/perfil-optimizado/perfil-optimizado.resolver';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [InformacionUsuarioComponent],
})
export class PerfilComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);

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
  public categoriasProfesion: CategoriaProfesionModel[] = [];

  //Subscription
  public usuarioSubscription: Subscription;

  get OPERACION() {
    return OPERACION;
  }

  ngOnInit(): void {
    // Usar datos del resolver optimizado que usa caché
    this.activatedRoute.data.subscribe((data: { perfilData: PerfilData }) => {
      if (data.perfilData) {
        const { catalogos, usuario } = data.perfilData;

        // Asignar catálogos con filtros aplicados
        this.nacionalidades = catalogos.nacionalidades;
        this.estadoCivil = catalogos.estadoCivil;
        this.rolCasa = catalogos.rolCasa;
        this.generos = catalogos.generos;
        this.gradosAcademicos = catalogos.gradosAcademicos;
        this.tipoMiembros = catalogos.tipoMiembros;
        this.congregaciones = catalogos.congregaciones.filter(
          (congregacion: CongregacionModel) => congregacion.estado === true,
        );
        this.ministerios = catalogos.ministerios.filter((ministerio: MinisterioModel) => ministerio.estado === true);
        this.voluntariados = catalogos.voluntariados;
        this.paises = catalogos.paises.filter((pais: CongregacionPaisModel) => pais.estado === true);
        this.campos = catalogos.campos.filter((campo: CampoModel) => campo.estado === true);
        this.tiposDeDocumentos = catalogos.tiposDeDocumentos.filter(
          (tipoDocumento: TipoDocumentoModel) => tipoDocumento.estado === true,
        );
        this.categoriasProfesion = catalogos.categoriasProfesion.filter(
          (categoria: CategoriaProfesionModel) => categoria.estado === true,
        );

        // Asignar usuario
        if (usuario) {
          this.usuario = usuario.usuario;
        }
      }
    });
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
          },
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
