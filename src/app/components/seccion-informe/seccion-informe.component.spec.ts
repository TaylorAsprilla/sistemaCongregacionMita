import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionInformeComponent } from './seccion-informe.component';

describe('SeccionInformeComponent', () => {
  let component: SeccionInformeComponent;
  let fixture: ComponentFixture<SeccionInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeccionInformeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
