import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionDeRegistroComponent } from './confirmacion-de-registro.component';

describe('ConfirmacionDeRegistroComponent', () => {
  let component: ConfirmacionDeRegistroComponent;
  let fixture: ComponentFixture<ConfirmacionDeRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConfirmacionDeRegistroComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionDeRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
