import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInformeComponent } from './ver-informe.component';

describe('VerInformeComponent', () => {
  let component: VerInformeComponent;
  let fixture: ComponentFixture<VerInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerInformeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
