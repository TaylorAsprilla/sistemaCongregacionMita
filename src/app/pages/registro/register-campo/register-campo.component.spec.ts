import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCampoComponent } from './register-campo.component';

describe('RegisterCampoComponent', () => {
  let component: RegisterCampoComponent;
  let fixture: ComponentFixture<RegisterCampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCampoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
