import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCongregacionComponent } from './reporte-congregacion.component';

describe('ReporteCongregacionComponent', () => {
  let component: ReporteCongregacionComponent;
  let fixture: ComponentFixture<ReporteCongregacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCongregacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCongregacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
