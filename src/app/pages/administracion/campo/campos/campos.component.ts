import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { CampoService } from 'src/app/services/campo/campo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campos',
  templateUrl: './campos.component.html',
  styleUrls: ['./campos.component.css'],
})
export class CamposComponent implements OnInit {
  public cargando: boolean = true;
  public campos: CampoModel[] = [];
  public obreros: UsuarioModel[] = [];
  public paises: PaisModel[] = [];
  public congregaciones: CongregacionModel[] = [];

  constructor(private router: Router, private campoService: CampoService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data: { obrero: UsuarioModel[]; pais: PaisModel[]; congregacion: CongregacionModel[] }) => {
        this.obreros = data.obrero;
        this.paises = data.pais;
        this.congregaciones = data.congregacion;
      }
    );

    this.cargarCampos();
  }

  cargarCampos() {
    this.cargando = true;
    this.campoService
      .getCampos()
      .pipe(delay(100))
      .subscribe((campos: CampoModel[]) => {
        this.campos = campos;
        this.cargando = false;
      });
  }

  borrarCampo(campo: CampoModel) {
    Swal.fire({
      title: '¿Borrar Campo?',
      text: `Esta seguro de borrar el campo de ${campo.campo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.campoService.eliminarCampo(campo).subscribe((campoEliminado) => {
          Swal.fire('¡Deshabilitado!', `El campo ${campo.campo} fue deshabilitado correctamente`, 'success');

          this.cargarCampos();
        });
      }
    });
  }

  activarCampo(campo: CampoModel) {
    Swal.fire({
      title: 'Activar Campo',
      text: `Esta seguro de activar el campo de ${campo.campo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.campoService.activarCampo(campo).subscribe((campoActivo) => {
          Swal.fire('¡Activado!', `El campo ${campo.campo} fue activado correctamente`, 'success');

          this.cargarCampos();
        });
      }
    });
  }

  actualizarCampo(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CAMPOS}/${id}`);
  }

  crearCampo() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CAMPOS}/${nuevo}`);
  }

  buscarObrero(idObrero: number): string {
    let obrero = this.obreros.find((obrero) => obrero.id === idObrero);

    const nombreObrero = obrero
      ? obrero?.primerNombre +
        ' ' +
        obrero?.segundoNombre +
        ' ' +
        obrero?.primerApellido +
        ' ' +
        obrero?.segundoApellido
      : 'Sin obrero Asignado';

    return nombreObrero;
  }

  buscarPais(idPais: number): string {
    return this.paises.find((pais) => pais.id === idPais)?.pais;
  }

  buscarCongregacion(idCongregacion: number): object {
    const congregacion = this.congregaciones.find((congregacion) => congregacion.id === idCongregacion);

    this.buscarPais(congregacion?.pais_id);

    return { congregacion: congregacion?.congregacion, pais: this.buscarPais(congregacion?.pais_id) };
  }
}
