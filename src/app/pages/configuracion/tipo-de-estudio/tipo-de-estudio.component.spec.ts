import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeEstudioComponent } from './tipo-de-estudio.component';

describe('TipoDeEstudioComponent', () => {
  let component: TipoDeEstudioComponent;
  let fixture: ComponentFixture<TipoDeEstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TipoDeEstudioComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TipoDeEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
