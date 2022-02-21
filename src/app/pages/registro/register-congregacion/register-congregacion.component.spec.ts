import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCongregacionComponent } from './register-congregacion.component';

describe('RegisterCongComponent', () => {
  let component: RegisterCongregacionComponent;
  let fixture: ComponentFixture<RegisterCongregacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterCongregacionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCongregacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
