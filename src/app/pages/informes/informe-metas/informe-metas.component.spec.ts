import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { MetaService } from 'src/app/services/meta/meta.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { EstatusService } from 'src/app/services/estatus/estatus.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { InformeMetasComponent } from './informe-metas.component';

describe('InformeMetasComponent', () => {
  let component: InformeMetasComponent;
  let metaService: jasmine.SpyObj<MetaService>;

  beforeEach(async () => {
    metaService = jasmine.createSpyObj('MetaService', [
      'getMetasPendientesByInforme', 'getMetasByInforme', 'copiarMeta', 'cumplirMeta',
    ]);
    metaService.getMetasPendientesByInforme.and.returnValue(of([]));
    metaService.getMetasByInforme.and.returnValue(of([]));
    metaService.copiarMeta.and.returnValue(of({ ok: true, meta: { id: 90 } } as any));
    metaService.cumplirMeta.and.returnValue(of({ ok: true }));
    await TestBed.configureTestingModule({
      imports: [InformeMetasComponent],
      providers: [
        { provide: Router, useValue: {} },
        { provide: InformeService, useValue: { informeActivoId: 20 } },
        { provide: MetaService, useValue: metaService },
        { provide: EstatusService, useValue: { getEstatus: () => of([]) } },
        { provide: UsuarioService, useValue: { usuarioId: 1 } },
      ],
    }).overrideComponent(InformeMetasComponent, { set: { template: '' } }).compileComponents();
    const fixture = TestBed.createComponent(InformeMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('consulta las metas pendientes por informe seleccionado y no por creador', () => {
    expect(metaService.getMetasPendientesByInforme).toHaveBeenCalledWith(20);
  });

  it('completa la continuación en el informe actual sin modificar la meta histórica', fakeAsync(() => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, value: 'Objetivo cumplido' } as any);
    component.cumplirMeta({ id: 5, informe_id: 10, meta: 'Meta histórica' } as any);
    flushMicrotasks();
    expect(metaService.copiarMeta).toHaveBeenCalledWith({
      meta_id_original: 5, nuevo_informe_id: 20, actualizacion: 'Objetivo cumplido',
    });
    expect(metaService.cumplirMeta).toHaveBeenCalledWith(90, 'Objetivo cumplido');
    expect(metaService.cumplirMeta).not.toHaveBeenCalledWith(5, jasmine.anything());
  }));

  it('completa directamente una meta que ya pertenece al informe actual', fakeAsync(() => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, value: 'Cumplida' } as any);
    component.cumplirMeta({ id: 5, informe_id: 20, meta: 'Meta actual' } as any);
    flushMicrotasks();
    expect(metaService.copiarMeta).not.toHaveBeenCalled();
    expect(metaService.cumplirMeta).toHaveBeenCalledWith(5, 'Cumplida');
  }));
});
