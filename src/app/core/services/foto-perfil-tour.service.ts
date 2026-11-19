import { Injectable, inject } from '@angular/core';
import { driver, DriveStep } from 'driver.js';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { FotoPerfilDialogoService } from './foto-perfil-dialogo.service';

/** Tour guiado "cómo cambiar mi fotografía". */
@Injectable({ providedIn: 'root' })
export class FotoPerfilTourService {
  private usuarioService = inject(UsuarioService);
  private dialogo = inject(FotoPerfilDialogoService);

  /** Primer avatar clicable que esté realmente visible (el menú lateral puede estar oculto en móvil). */
  private avatarVisible(): HTMLElement | undefined {
    const candidatos = Array.from(document.querySelectorAll<HTMLElement>('button.avatar-cambiar'));
    return candidatos.find((el) => el.getClientRects().length > 0);
  }

  construirPasos(nombre: string | undefined, avatar: HTMLElement | undefined, alTerminar: () => void): DriveStep[] {
    const saludo = nombre ? `¡Hola, ${nombre}!` : '¡Hola!';
    return [
      {
        popover: {
          title: `📸 ${saludo}`,
          description:
            'Ahora puede <b>personalizar su perfil con una fotografía</b> para que los demás le reconozcan. ' +
            'Le mostramos cómo hacerlo en 3 pasos.',
          nextBtnText: 'Empezar',
        },
      },
      {
        element: avatar,
        popover: {
          title: '1. Haga clic en su foto',
          description: 'Toque su foto o iniciales. No hace falta ir al perfil: se abre el selector de imágenes.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: avatar,
        popover: {
          title: '2. Elija y ajuste la imagen',
          description:
            'Acepta <b>JPG, PNG o WEBP</b> de hasta 5 MB (mínimo 200 × 200 px). ' +
            'Se recorta en círculo: mueva y acerque la imagen hasta que quede como desea.',
          side: 'right',
          align: 'start',
        },
      },
      {
        popover: {
          title: '3. Guarde y listo',
          description:
            'Su foto se actualiza al instante en todo el sistema. Podrá cambiarla o quitarla cuando quiera.',
          doneBtnText: 'Subir mi fotografía',
          onNextClick: (_el, _paso, { driver: guia }) => {
            guia.destroy();
            alTerminar();
          },
        },
      },
    ];
  }

  iniciar(): void {
    const avatar = this.avatarVisible();
    const guia = driver({
      showProgress: true,
      progressText: 'Paso {{current}} de {{total}}',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Atrás',
      doneBtnText: 'Entendido',
      allowClose: true,
      overlayOpacity: 0.55,
      stagePadding: 8,
      stageRadius: 50,
      popoverClass: 'tour-foto-perfil',
      steps: this.construirPasos(this.usuarioService.usuario?.primerNombre, avatar, () =>
        this.dialogo.abrirSelector(),
      ),
    });
    guia.drive();
  }
}
