import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import { esFotoGestionada, iniciales } from 'src/app/core/utils/foto-perfil';

/**
 * Avatar circular de un usuario: muestra su fotografía o, si no tiene o falla la carga, sus iniciales.
 *
 * - `foto`: clave conocida (`null` = sin foto, no consulta nada; `undefined` = se consulta por `usuarioId`).
 * - Se actualiza solo cuando el propio usuario cambia o elimina su fotografía.
 * - Las URLs se resuelven en lote y con caché en `FotoPerfilService`.
 */
@Component({
  selector: 'app-avatar-usuario',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="avatar-usuario"
      role="img"
      [attr.aria-label]="nombre() ? 'Fotografía de ' + nombre() : 'Fotografía de usuario'"
      [style.width.px]="tamano()"
      [style.height.px]="tamano()"
      [style.fontSize.px]="tamano() * 0.4"
    >
      @if (url() && !fallo()) {
        <img [src]="url()" alt="" draggable="false" (error)="alFallarImagen()" />
      } @else {
        <span class="iniciales" aria-hidden="true">{{ iniciales() }}</span>
      }
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
        vertical-align: middle;
      }
      .avatar-usuario {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        background: #1976d2;
        color: #fff;
        font-weight: 300;
        letter-spacing: 0.5px;
        line-height: 1;
        flex-shrink: 0;
        user-select: none;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    `,
  ],
})
export class AvatarUsuarioComponent {
  private fotoService = inject(FotoPerfilService);

  usuarioId = input<number | undefined>();
  foto = input<string | null | undefined>(undefined);
  nombre = input<string>('');
  tamano = input<number>(40);

  protected url = signal<string | null>(null);
  protected fallo = signal(false);
  protected iniciales = computed(() => iniciales(this.nombre()));

  private reintentado = false;
  private solicitud = 0;

  /**
   * Foto a mostrar. Si el usuario cambió su foto en esta sesión esa clave tiene prioridad.
   * La igualdad personalizada evita reaccionar a cambios de fotografía de otros usuarios.
   */
  private fotoEfectiva = computed(
    () => {
      const id = this.usuarioId();
      const cambio = this.fotoService.cambio();
      return id !== undefined && cambio.id === id
        ? { foto: cambio.foto, revision: cambio.revision }
        : { foto: this.foto(), revision: 0 };
    },
    { equal: (a, b) => a.foto === b.foto && a.revision === b.revision },
  );

  constructor() {
    effect(() => {
      const id = this.usuarioId();
      const { foto } = this.fotoEfectiva();
      untracked(() => this.cargar(id, foto));
    });
  }

  protected alFallarImagen(): void {
    const id = this.usuarioId();
    if (!this.reintentado && id) {
      // La URL firmada pudo caducar: se pide una nueva una sola vez.
      this.reintentado = true;
      this.fotoService.invalidar(id);
      this.cargar(id, this.foto());
      return;
    }
    this.fallo.set(true);
  }

  private cargar(id: number | undefined, foto: string | null | undefined): void {
    const actual = ++this.solicitud;
    this.fallo.set(false);
    // Sin id, sin foto o con un valor heredado que no es una clave de nuestro bucket: solo iniciales.
    if (!id || foto === null || (typeof foto === 'string' && !esFotoGestionada(foto))) {
      this.url.set(null);
      return;
    }
    this.fotoService.resolverUrl(id, foto).then((url) => {
      // Ignora respuestas tardías de una solicitud anterior.
      if (actual === this.solicitud) {
        this.url.set(url);
      }
    });
  }
}
