import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeVisitasComponent } from './informe-visitas.component';

describe('InformeVisitasComponent', () => {
  let component: InformeVisitasComponent;
  let fixture: ComponentFixture<InformeVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InformeVisitasComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
