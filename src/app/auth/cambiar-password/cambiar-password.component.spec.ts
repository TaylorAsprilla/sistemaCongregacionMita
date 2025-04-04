import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarPasswordComponent } from './cambiar-password.component';

describe('CambiarPasswordComponent', () => {
  let component: CambiarPasswordComponent;
  let fixture: ComponentFixture<CambiarPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CambiarPasswordComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CambiarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
