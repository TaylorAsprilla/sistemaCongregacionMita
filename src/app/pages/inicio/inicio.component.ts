import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROUTES } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  totalUsuarios: number;

  paises: PaisModel[] = [];
  congregaciones: CongregacionModel[] = [];
  campos: CampoModel[] = [];
  ministerios: MinisterioModel[] = [];

  public sidebarnavItems: any[] = [];

  usuariosSubscription: Subscription;
  constructor(private usuarioServices: UsuarioService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data: {
        congregacion: CongregacionModel[];
        pais: PaisModel[];
        campo: CampoModel[];
        ministerio: MinisterioModel[];
      }) => {
        this.paises = data.pais;
        this.congregaciones = data.congregacion;
        this.campos = data.campo;
        this.ministerios = data.ministerio;
      }
    );

    this.usuariosSubscription = this.usuarioServices.listarUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.totalUsuarios = totalUsuarios;
      this.usuarios = usuarios;
    });

    this.sidebarnavItems = ROUTES.filter((sidebarnavItem) => sidebarnavItem);
  }

  ngOnDestroy(): void {
    this.usuariosSubscription?.unsubscribe();
  }
}
