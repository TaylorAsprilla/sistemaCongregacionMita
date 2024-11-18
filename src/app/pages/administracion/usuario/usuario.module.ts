import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CargandoInformacionModule } from 'src/app/components/cargando-informacion/cargando-informacion.module';
import { InformacionUsuarioModule } from 'src/app/components/informacion-usuario/informacion-usuario.module';
import { CambiarPasswordUsuarioComponent } from './cambiar-password-usuario/cambiar-password-usuario.component';
import { ConfirmacionDeRegistroComponent } from './confirmacion-de-registro/confirmacion-de-registro.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination'; //Imports NgxPaginationModule
import { VerCensoModule } from 'src/app/components/ver-censo/ver-censo.module';
import { ExportarExcelModule } from 'src/app/components/exportar-excel/exportar-excel.module';

@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        InformacionUsuarioModule,
        CargandoInformacionModule,
        PipesModule,
        NgxPaginationModule,
        VerCensoModule,
        ExportarExcelModule,
        ConfirmacionDeRegistroComponent,
        RegistrarUsuarioComponent,
        UsuariosComponent,
        CambiarPasswordUsuarioComponent,
    ],
    exports: [
        ConfirmacionDeRegistroComponent,
        RegistrarUsuarioComponent,
        UsuariosComponent,
        CambiarPasswordUsuarioComponent,
    ],
})
export class UsuarioModule {}
