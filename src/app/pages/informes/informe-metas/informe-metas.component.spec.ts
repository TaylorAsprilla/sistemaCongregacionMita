import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeMetasComponent } from './informe-metas.component';

describe('InformeMetasComponent', () => {
  let component: InformeMetasComponent;
  let fixture: ComponentFixture<InformeMetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InformeMetasComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
