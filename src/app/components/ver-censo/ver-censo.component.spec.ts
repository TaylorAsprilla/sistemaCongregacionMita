import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCensoComponent } from './ver-censo.component';

describe('VerCensoComponent', () => {
  let component: VerCensoComponent;
  let fixture: ComponentFixture<VerCensoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VerCensoComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(VerCensoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
