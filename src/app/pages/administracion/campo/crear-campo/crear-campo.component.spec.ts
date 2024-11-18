import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCampoComponent } from './crear-campo.component';

describe('CrearCampoComponent', () => {
  let component: CrearCampoComponent;
  let fixture: ComponentFixture<CrearCampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CrearCampoComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
