import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeContablesComponent } from './informe-contables.component';

describe('InformeContablesComponent', () => {
  let component: InformeContablesComponent;
  let fixture: ComponentFixture<InformeContablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InformeContablesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
