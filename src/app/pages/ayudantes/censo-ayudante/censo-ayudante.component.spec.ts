import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoAyudanteComponent } from './censo-ayudante.component';

describe('CensoAyudanteComponent', () => {
  let component: CensoAyudanteComponent;
  let fixture: ComponentFixture<CensoAyudanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CensoAyudanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CensoAyudanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
