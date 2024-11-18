import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargandoInformacionComponent } from './cargando-informacion.component';

describe('CargandoInformacionComponent', () => {
  let component: CargandoInformacionComponent;
  let fixture: ComponentFixture<CargandoInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CargandoInformacionComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargandoInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
