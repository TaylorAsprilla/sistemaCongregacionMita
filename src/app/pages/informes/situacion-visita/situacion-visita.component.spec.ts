import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacionVisitaComponent } from './situacion-visita.component';

describe('SituacionVisitaComponent', () => {
  let component: SituacionVisitaComponent;
  let fixture: ComponentFixture<SituacionVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SituacionVisitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SituacionVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
