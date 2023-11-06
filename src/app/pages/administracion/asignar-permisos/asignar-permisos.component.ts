import Swal from 'sweetalert2';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PermisoService } from 'src/app/services/permiso/permiso.service';
import { PermisoModel } from 'src/app/core/models/permisos.model';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-asignar-permisos',
  templateUrl: './asignar-permisos.component.html',
  styleUrls: ['./asignar-permisos.component.scss'],
})
export class AsignarPermisosComponent implements OnInit {
  permisosForm: FormGroup;
  numeroMitaForm: FormGroup;

  usuarios: UsuarioModel[] = [];
  usuarioEncontrado: UsuarioModel;
  permisos: PermisoModel[] = [];

  permisosUsuario: number[];

  usuarioSubscription: Subscription;
  permisoSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private permisosService: PermisoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { usuario: UsuarioModel[] }) => {
      this.usuarios = data.usuario;
    });

    this.permisoSubscription = this.permisosService.getPermisos().subscribe((permiso: PermisoModel[]) => {
      this.permisos = permiso;
    });

    this.crearFormularioNumeroMita();
    this.crearFormularioPermisos();
  }

  ngOnDestroy(): void {
    this.permisoSubscription?.unsubscribe();
    this.usuarioSubscription?.unsubscribe();
  }

  crearFormularioNumeroMita() {
    this.numeroMitaForm = this.formBuilder.group({
      numeroMita: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  crearFormularioPermisos() {
    const controlPermisos = this.permisos.map((control) => this.formBuilder.control(false));
    this.permisosForm = this.formBuilder.group({
      permisos: this.formBuilder.array(controlPermisos),
    });
  }

  get permisosArr() {
    return this.permisosForm?.get('permisos') as FormArray;
  }

  buscarFeligres(id: string) {
    this.usuarioSubscription = this.usuarioService.getUsuario(id).subscribe(
      (respuesta: any) => {
        if (!!respuesta.usuario) {
          this.usuarioEncontrado = respuesta.usuario;

          Swal.fire({
            position: 'top-end',
            text: `${this.usuarioEncontrado.primerNombre} ${this.usuarioEncontrado.segundoNombre}
                ${this.usuarioEncontrado.primerApellido} ${this.usuarioEncontrado.segundoApellido},
                Número Mita ${this.usuarioEncontrado.id}`,
            timer: 1500,
            showConfirmButton: false,
          });
          this.crearFormularioPermisos();
          this.patchValuePermisos();
        } else {
          Swal.fire({
            position: 'top-end',
            text: `${respuesta.msg}`,
            icon: 'error',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      },
      (error) => {
        let errores = error.error.msg;

        Swal.fire({
          title: 'Error al encontrar el feligrés',
          icon: 'error',
          html: errores,
        });
      }
    );
  }

  arrayUsuarioData() {
    const data = this.usuarioEncontrado?.usuarioPermiso;
    return Array.isArray(data) ? data.map((item: any) => item?.id).filter(Boolean) : [];
  }

  patchValuePermisos() {
    this.permisosUsuario = this.arrayUsuarioData();

    this.permisos.map((permiso: PermisoModel, i: number) => {
      if (this.permisosUsuario?.indexOf(permiso.id) !== -1) {
        this.permisosArr.at(i)?.patchValue(true);
      }
    });
  }

  gestionarPermiso(index: number, event: any) {
    const selectedPermisos = this.permisosForm.get('permisos') as FormArray;

    if (event.target.checked) {
      selectedPermisos.push(this.formBuilder.control(this.permisos[index].id));
    } else {
      const index = selectedPermisos.controls.findIndex((x) => x.value === event.target.value);
      selectedPermisos.removeAt(index);
    }
  }

  permisosSelecionados(): number[] {
    const permisosSeleccionados = this.permisosForm.value.permisos
      .map((checked: any, i: number) => (checked ? this.permisos[i].id : null))
      .filter((value: any) => value !== null);
    return permisosSeleccionados;
  }

  agregarPermisos() {
    const permisosSeleccionados = this.permisosSelecionados();

    if (permisosSeleccionados.length === 0) {
      Swal.fire('Error', 'Debes seleccionar al menos un permiso', 'error');
      return;
    }

    this.usuarioService.actualizarPermisos(this.usuarioEncontrado.id, permisosSeleccionados).subscribe(
      (usuarioActualizado) => {
        Swal.fire('Actualizado', 'Los permisos del usuario se agregaron satisfactoriamente', 'success');
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

  actualizarUsuario(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${id}`);
  }
}
