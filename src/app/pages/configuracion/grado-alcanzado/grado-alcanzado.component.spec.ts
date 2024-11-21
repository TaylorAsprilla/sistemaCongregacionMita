import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradoAlcanzadoComponent } from './grado-alcanzado.component';

describe('GradoAlcanzadoComponent', () => {
  let component: GradoAlcanzadoComponent;
  let fixture: ComponentFixture<GradoAlcanzadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [GradoAlcanzadoComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(GradoAlcanzadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
