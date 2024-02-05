import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-confirmacion-de-registro',
  templateUrl: './confirmacion-de-registro.component.html',
  styleUrls: ['./confirmacion-de-registro.component.scss'],
})
export class ConfirmacionDeRegistroComponent implements OnInit {
  usuario: UsuarioModel;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarUsuario(id);
    });
  }

  buscarUsuario(id: number) {
    this.usuarioService
      .getUsuario(id)
      .pipe(delay(100))
      .subscribe((respuesta: any) => {
        this.usuario = respuesta.usuario;
        console.info(respuesta);
      });
  }

  nuevoRegistro() {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/nuevo`);
  }
}
