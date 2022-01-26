import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongregacionesComponent } from './congregaciones.component';

describe('CongregacionesComponent', () => {
  let component: CongregacionesComponent;
  let fixture: ComponentFixture<CongregacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongregacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongregacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
