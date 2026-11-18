import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { FotoPerfilDialogoService } from 'src/app/core/services/foto-perfil-dialogo.service';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import { MENSAJES_FOTO } from 'src/app/core/utils/foto-perfil';
import { FotoPerfilDialogoComponent } from './foto-perfil-dialogo.component';

async function crearImagen(ancho: number, alto: number, tipo = 'image/png'): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;
  canvas.getContext('2d')!.fillRect(0, 0, ancho, alto);
  const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), tipo));
  return new File([blob], 'foto.png', { type: tipo });
}

describe('FotoPerfilDialogoComponent', () => {
  let fixture: ComponentFixture<FotoPerfilDialogoComponent>;
  let servicio: { subir: jasmine.Spy; mensajeDeError: jasmine.Spy };
  let dialogoService: FotoPerfilDialogoService;

  beforeEach(async () => {
    servicio = {
      subir: jasmine.createSpy().and.returnValue(of({ progreso: 100, resultado: { ok: true, foto: 'k', url: 'u' } })),
      mensajeDeError: jasmine.createSpy().and.returnValue('mensaje del servicio'),
    };
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
    await TestBed.configureTestingModule({
      imports: [FotoPerfilDialogoComponent],
      providers: [{ provide: FotoPerfilService, useValue: servicio }],
    }).compileComponents();
    dialogoService = TestBed.inject(FotoPerfilDialogoService);
    fixture = TestBed.createComponent(FotoPerfilDialogoComponent);
    fixture.detectChanges();
  });

  const el = () => fixture.nativeElement as HTMLElement;
  const entrada = () => el().querySelector('input[type=file]') as HTMLInputElement;
  const boton = (texto: string) =>
    Array.from(el().querySelectorAll('[role=dialog] button')).find((b) => b.textContent?.includes(texto)) as HTMLButtonElement;
  const seleccionar = async (archivo: File) => {
    const lista = new DataTransfer();
    lista.items.add(archivo);
    entrada().files = lista.files;
    entrada().dispatchEvent(new Event('change'));
    await new Promise((r) => setTimeout(r, 100));
    fixture.detectChanges();
  };

  it('se registra en el servicio y abrirSelector() hace clic en el selector de archivos', () => {
    const clic = spyOn(entrada(), 'click');
    expect(dialogoService.abrirSelector()).toBeTrue();
    expect(clic).toHaveBeenCalledTimes(1);
  });

  it('al destruirse deja de estar disponible', () => {
    fixture.destroy();
    expect(dialogoService.abrirSelector()).toBeFalse();
  });

  it('el selector solo acepta JPG, PNG y WEBP', () => {
    expect(entrada().accept).toBe('image/jpeg,image/png,image/webp');
  });

  it('rechaza un archivo que no es imagen real sin abrir el recorte', async () => {
    await seleccionar(new File(['<html>'], 'foto.jpg', { type: 'image/jpeg' }));
    expect(el().querySelector('[role=dialog]')).toBeNull();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', text: MENSAJES_FOTO.formato }));
    expect(servicio.subir).not.toHaveBeenCalled();
  });

  it('rechaza imágenes menores a 200x200', async () => {
    await seleccionar(await crearImagen(100, 100));
    expect(el().querySelector('[role=dialog]')).toBeNull();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: MENSAJES_FOTO.dimension }));
  });

  it('flujo completo: vista previa, cancelar y luego confirmar sube la imagen recortada', async () => {
    await seleccionar(await crearImagen(600, 400));
    expect(el().querySelector('[role=dialog] canvas')).not.toBeNull();

    boton('Cancelar').click();
    fixture.detectChanges();
    expect(el().querySelector('[role=dialog]')).toBeNull();
    expect(servicio.subir).not.toHaveBeenCalled();

    await seleccionar(await crearImagen(600, 400));
    boton('Guardar').click();
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
    await seleccionar(await crearImagen(300, 300));
    boton('Guardar').click();
    await new Promise((r) => setTimeout(r, 200));
    fixture.detectChanges();
    expect(el().querySelector('[role=dialog]')).not.toBeNull();
    expect(el().querySelector('.alert-danger')?.textContent).toContain('mensaje del servicio');
    expect(el().textContent).toContain('Reintentar');
  });
});
