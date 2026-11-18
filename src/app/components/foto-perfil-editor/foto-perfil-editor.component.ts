import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { FotoPerfilDialogoService } from 'src/app/core/services/foto-perfil-dialogo.service';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import { MENSAJES_FOTO } from 'src/app/core/utils/foto-perfil';
import { AvatarUsuarioComponent } from 'src/app/shared/avatar-usuario/avatar-usuario.component';

/**
 * Tarjeta del perfil con la fotografía actual y sus acciones.
 * El selector y el recorte los gestiona `FotoPerfilDialogoComponent` (layout autenticado).
 */
@Component({
  selector: 'app-foto-perfil-editor',
  standalone: true,
  imports: [AvatarUsuarioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './foto-perfil-editor.component.html',
  styleUrls: ['./foto-perfil-editor.component.scss'],
})
export class FotoPerfilEditorComponent {
  private fotoService = inject(FotoPerfilService);
  private dialogo = inject(FotoPerfilDialogoService);

  usuarioId = input.required<number>();
  nombre = input<string>('');
  foto = input<string | null | undefined>(undefined);
  /** Solo el propietario ve los controles; el backend lo valida de todas formas. */
  editable = input<boolean>(false);

  protected eliminando = signal(false);
  protected tieneFoto = computed(() => {
    const cambio = this.fotoService.cambio();
    const foto = cambio.id === this.usuarioId() ? cambio.foto : this.foto();
    return foto === undefined ? true : !!foto;
  });

  protected abrirSelector(): void {
    if (this.editable() && !this.eliminando()) {
      this.dialogo.abrirSelector();
    }
  }

  protected async eliminar(): Promise<void> {
    if (!this.editable() || this.eliminando()) return;
    const respuesta = await Swal.fire({
      title: 'Eliminar fotografía',
      text: 'Se volverá a mostrar el avatar predeterminado con sus iniciales. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!respuesta.isConfirmed) return;

    this.eliminando.set(true);
    this.fotoService.eliminar().subscribe({
      next: () => {
        this.eliminando.set(false);
        Swal.fire({ icon: 'success', title: 'Listo', text: MENSAJES_FOTO.eliminada, timer: 2500 });
      },
      error: (error) => {
        this.eliminando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.fotoService.mensajeDeError(error, MENSAJES_FOTO.eliminar),
        });
      },
    });
  }
}
