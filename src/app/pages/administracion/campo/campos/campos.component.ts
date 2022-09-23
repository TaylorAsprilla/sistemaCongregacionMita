import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampoModel } from 'src/app/core/models/campo.model';
import { Rutas } from 'src/app/routes/menu-items';
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

  constructor(private router: Router, private campoService: CampoService) {}

  ngOnInit(): void {
    this.cargarCampos();
  }

  cargarCampos() {
    this.cargando = true;
    this.campoService.listarCampo().subscribe((campos: CampoModel[]) => {
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
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CAMPOS}/${id}`);
  }

  crearCampo() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.CAMPOS}/${nuevo}`);
  }
}
