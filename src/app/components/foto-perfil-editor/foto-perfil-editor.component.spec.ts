import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { FotoPerfilDialogoService } from 'src/app/core/services/foto-perfil-dialogo.service';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import { MENSAJES_FOTO } from 'src/app/core/utils/foto-perfil';
import { FotoPerfilEditorComponent } from './foto-perfil-editor.component';

describe('FotoPerfilEditorComponent', () => {
  let fixture: ComponentFixture<FotoPerfilEditorComponent>;
  let servicio: {
    cambio: ReturnType<typeof signal>;
    resolverUrl: jasmine.Spy;
    invalidar: jasmine.Spy;
    eliminar: jasmine.Spy;
    mensajeDeError: jasmine.Spy;
  };
  let dialogo: { abrirSelector: jasmine.Spy };

  beforeEach(async () => {
    servicio = {
      cambio: signal({ id: 0, foto: null, revision: 0 }),
      resolverUrl: jasmine.createSpy().and.resolveTo(null),
      invalidar: jasmine.createSpy(),
      eliminar: jasmine.createSpy().and.returnValue(of({ ok: true, foto: null })),
      mensajeDeError: jasmine.createSpy().and.returnValue('mensaje del servicio'),
    };
    dialogo = { abrirSelector: jasmine.createSpy().and.returnValue(true) };
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
    await TestBed.configureTestingModule({
      imports: [FotoPerfilEditorComponent],
      providers: [
        { provide: FotoPerfilService, useValue: servicio },
        { provide: FotoPerfilDialogoService, useValue: dialogo },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FotoPerfilEditorComponent);
    fixture.componentRef.setInput('usuarioId', 7);
    fixture.componentRef.setInput('nombre', 'Ana López');
  });

  const el = () => fixture.nativeElement as HTMLElement;
  const boton = (texto: string) =>
    Array.from(el().querySelectorAll('button')).find((b) => b.textContent?.includes(texto)) as HTMLButtonElement;

  it('sin permiso de edición no muestra controles', () => {
    fixture.componentRef.setInput('editable', false);
    fixture.detectChanges();
    expect(el().querySelectorAll('button').length).toBe(0);
  });

  it('el botón y el ícono de cámara abren el selector global', () => {
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    boton('Cambiar fotografía').click();
    (el().querySelector('.foto-perfil__editar') as HTMLButtonElement).click();
    expect(dialogo.abrirSelector).toHaveBeenCalledTimes(2);
  });

  it('eliminar pide confirmación y llama al servicio', async () => {
    fixture.componentRef.setInput('editable', true);
    fixture.componentRef.setInput('foto', 'usuarios/fotos-perfil/7/a.webp');
    fixture.detectChanges();
    boton('Eliminar').click();
    await new Promise((r) => setTimeout(r, 50));
    expect(servicio.eliminar).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: MENSAJES_FOTO.eliminada }));
  });

  it('sin fotografía ofrece "Subir" y no muestra "Eliminar"', () => {
    fixture.componentRef.setInput('editable', true);
    fixture.componentRef.setInput('foto', null);
    fixture.detectChanges();
    expect(el().textContent).toContain('Subir fotografía');
    expect(el().textContent).not.toContain('Eliminar fotografía');
  });

  it('con fotografía ofrece "Cambiar"', () => {
    fixture.componentRef.setInput('editable', true);
    fixture.componentRef.setInput('foto', 'usuarios/fotos-perfil/7/a.webp');
    fixture.detectChanges();
    expect(el().textContent).toContain('Cambiar fotografía');
  });
});
