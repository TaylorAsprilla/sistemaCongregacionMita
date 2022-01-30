import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMinisterioComponent } from './register-ministerio.component';

describe('RegisterMinisterioComponent', () => {
  let component: RegisterMinisterioComponent;
  let fixture: ComponentFixture<RegisterMinisterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterMinisterioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMinisterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
