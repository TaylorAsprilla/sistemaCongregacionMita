import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import { FotoPerfilEditorComponent } from './foto-perfil-editor.component';
import { MENSAJES_FOTO } from 'src/app/core/utils/foto-perfil';

async function crearImagen(ancho: number, alto: number, tipo = 'image/png'): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;
  canvas.getContext('2d')!.fillRect(0, 0, ancho, alto);
  const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), tipo));
  return new File([blob], 'foto.png', { type: tipo });
}

describe('FotoPerfilEditorComponent', () => {
  let fixture: ComponentFixture<FotoPerfilEditorComponent>;
  let servicio: {
    cambio: ReturnType<typeof signal>;
    resolverUrl: jasmine.Spy;
    invalidar: jasmine.Spy;
    subir: jasmine.Spy;
    eliminar: jasmine.Spy;
    mensajeDeError: jasmine.Spy;
  };

  beforeEach(async () => {
    servicio = {
      cambio: signal({ id: 0, foto: null, revision: 0 }),
      resolverUrl: jasmine.createSpy().and.resolveTo(null),
      invalidar: jasmine.createSpy(),
      subir: jasmine.createSpy().and.returnValue(of({ progreso: 100, resultado: { ok: true, foto: 'k', url: 'u' } })),
      eliminar: jasmine.createSpy().and.returnValue(of({ ok: true, foto: null })),
      mensajeDeError: jasmine.createSpy().and.returnValue('mensaje del servicio'),
    };
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
    await TestBed.configureTestingModule({
      imports: [FotoPerfilEditorComponent],
      providers: [{ provide: FotoPerfilService, useValue: servicio }],
    }).compileComponents();
    fixture = TestBed.createComponent(FotoPerfilEditorComponent);
    fixture.componentRef.setInput('usuarioId', 7);
    fixture.componentRef.setInput('nombre', 'Ana López');
  });

  const el = () => fixture.nativeElement as HTMLElement;
  const seleccionar = async (archivo: File) => {
    const input = el().querySelector('input[type=file]') as HTMLInputElement;
    const lista = new DataTransfer();
    lista.items.add(archivo);
    input.files = lista.files;
    input.dispatchEvent(new Event('change'));
    await new Promise((r) => setTimeout(r, 100));
    fixture.detectChanges();
  };

  it('sin permiso de edición no muestra controles ni selector', () => {
    fixture.componentRef.setInput('editable', false);
    fixture.detectChanges();
    expect(el().querySelector('input[type=file]')).toBeNull();
    expect(el().querySelectorAll('button').length).toBe(0);
  });

  it('el selector solo acepta JPG, PNG y WEBP', () => {
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    expect((el().querySelector('input[type=file]') as HTMLInputElement).accept).toBe('image/jpeg,image/png,image/webp');
  });

  it('rechaza un archivo que no es imagen real sin abrir el recorte', async () => {
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    await seleccionar(new File(['<html>'], 'foto.jpg', { type: 'image/jpeg' }));
    expect(el().querySelector('[role=dialog]')).toBeNull();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', text: MENSAJES_FOTO.formato }));
    expect(servicio.subir).not.toHaveBeenCalled();
  });

  it('rechaza imágenes menores a 200x200', async () => {
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    await seleccionar(await crearImagen(100, 100));
    expect(el().querySelector('[role=dialog]')).toBeNull();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: MENSAJES_FOTO.dimension }));
  });

  it('flujo completo: vista previa, cancelar y luego confirmar sube la imagen recortada', async () => {
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();

    await seleccionar(await crearImagen(600, 400));
    expect(el().querySelector('[role=dialog] canvas')).not.toBeNull();

    // Cancelar cierra sin subir.
    (Array.from(el().querySelectorAll('[role=dialog] button')).find((b) => b.textContent?.includes('Cancelar')) as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el().querySelector('[role=dialog]')).toBeNull();
    expect(servicio.subir).not.toHaveBeenCalled();

    // Confirmar: sube un blob cuadrado de 512x512 y cierra el diálogo.
    await seleccionar(await crearImagen(600, 400));
    (Array.from(el().querySelectorAll('[role=dialog] button')).find((b) => b.textContent?.includes('Guardar')) as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 200));
    fixture.detectChanges();

    expect(servicio.subir).toHaveBeenCalledTimes(1);
    const blob: Blob = servicio.subir.calls.mostRecent().args[0];
    expect(['image/webp', 'image/png']).toContain(blob.type);
    const bitmap = await createImageBitmap(blob);
    expect([bitmap.width, bitmap.height]).toEqual([512, 512]);
    expect(el().querySelector('[role=dialog]')).toBeNull();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success', text: MENSAJES_FOTO.actualizada }));
  });

  it('si la subida falla mantiene el diálogo abierto y muestra el error para reintentar', async () => {
    servicio.subir.and.returnValue(throwError(() => new Error('red')));
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    await seleccionar(await crearImagen(300, 300));
    (Array.from(el().querySelectorAll('[role=dialog] button')).find((b) => b.textContent?.includes('Guardar')) as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 200));
    fixture.detectChanges();
    expect(el().querySelector('[role=dialog]')).not.toBeNull();
    expect(el().querySelector('.alert-danger')?.textContent).toContain('mensaje del servicio');
    expect(el().textContent).toContain('Reintentar');
  });

  it('eliminar pide confirmación y llama al servicio', async () => {
    fixture.componentRef.setInput('editable', true);
    fixture.componentRef.setInput('foto', 'usuarios/fotos-perfil/7/a.webp');
    fixture.detectChanges();
    (Array.from(el().querySelectorAll('button')).find((b) => b.textContent?.includes('Eliminar')) as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 50));
    expect(servicio.eliminar).toHaveBeenCalledTimes(1);
  });

  it('sin fotografía ofrece "Subir" y no muestra "Eliminar"', () => {
    fixture.componentRef.setInput('editable', true);
    fixture.componentRef.setInput('foto', null);
    fixture.detectChanges();
    expect(el().textContent).toContain('Subir fotografía');
    expect(el().textContent).not.toContain('Eliminar fotografía');
  });
});
