import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCongComponent } from './register-cong.component';

describe('RegisterCongComponent', () => {
  let component: RegisterCongComponent;
  let fixture: ComponentFixture<RegisterCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
