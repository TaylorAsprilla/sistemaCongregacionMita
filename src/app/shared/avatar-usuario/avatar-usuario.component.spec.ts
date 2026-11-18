import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import { AvatarUsuarioComponent } from './avatar-usuario.component';

@Component({
  standalone: true,
  imports: [AvatarUsuarioComponent],
  template: `<app-avatar-usuario [usuarioId]="id" [foto]="foto" [nombre]="nombre" [tamano]="48" />`,
})
class AnfitrionComponent {
  id = 7;
  foto: string | null | undefined = undefined;
  nombre = 'Ana López';
}

describe('AvatarUsuarioComponent', () => {
  let fixture: ComponentFixture<AnfitrionComponent>;
  let cambio: ReturnType<typeof signal<{ id: number; foto: string | null; revision: number }>>;
  let resolverUrl: jasmine.Spy;
  let invalidar: jasmine.Spy;

  beforeEach(async () => {
    cambio = signal({ id: 0, foto: null, revision: 0 });
    resolverUrl = jasmine.createSpy('resolverUrl').and.resolveTo('https://s3/foto.webp');
    invalidar = jasmine.createSpy('invalidar');
    await TestBed.configureTestingModule({
      imports: [AnfitrionComponent],
      providers: [{ provide: FotoPerfilService, useValue: { cambio, resolverUrl, invalidar } }],
    }).compileComponents();
    fixture = TestBed.createComponent(AnfitrionComponent);
  });

  async function renderizar() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  const img = () => fixture.nativeElement.querySelector('img') as HTMLImageElement | null;
  const texto = () => fixture.nativeElement.querySelector('.iniciales')?.textContent?.trim();

  it('muestra la fotografía cuando existe', async () => {
    await renderizar();
    expect(img()?.getAttribute('src')).toBe('https://s3/foto.webp');
    expect(texto()).toBeUndefined();
  });

  it('muestra iniciales y no consulta cuando se sabe que no tiene foto', async () => {
    fixture.componentInstance.foto = null;
    await renderizar();
    expect(img()).toBeNull();
    expect(texto()).toBe('AL');
    expect(resolverUrl).toHaveBeenCalledTimes(0);
  });

  it('muestra iniciales cuando el servidor no devuelve fotografía', async () => {
    resolverUrl.and.resolveTo(null);
    await renderizar();
    expect(img()).toBeNull();
    expect(texto()).toBe('AL');
  });

  it('si la imagen falla pide una URL nueva una vez y luego recurre a las iniciales', async () => {
    await renderizar();
    img()!.dispatchEvent(new Event('error'));
    await renderizar();
    expect(invalidar).toHaveBeenCalledOnceWith(7);
    expect(resolverUrl).toHaveBeenCalledTimes(2);

    img()!.dispatchEvent(new Event('error'));
    await renderizar();
    expect(img()).toBeNull();
    expect(texto()).toBe('AL');
  });

  it('se actualiza cuando el usuario cambia o elimina su fotografía', async () => {
    await renderizar();
    resolverUrl.and.resolveTo('https://s3/nueva.webp');
    cambio.set({ id: 7, foto: 'usuarios/fotos-perfil/7/n.webp', revision: 1 });
    await renderizar();
    expect(resolverUrl).toHaveBeenCalledWith(7, 'usuarios/fotos-perfil/7/n.webp');
    expect(img()?.getAttribute('src')).toBe('https://s3/nueva.webp');

    cambio.set({ id: 7, foto: null, revision: 2 });
    await renderizar();
    expect(img()).toBeNull();
    expect(texto()).toBe('AL');
  });

  it('ignora los cambios de otros usuarios', async () => {
    await renderizar();
    resolverUrl.calls.reset();
    cambio.set({ id: 99, foto: null, revision: 1 });
    await renderizar();
    expect(resolverUrl).not.toHaveBeenCalled();
    expect(img()).not.toBeNull();
  });
});
