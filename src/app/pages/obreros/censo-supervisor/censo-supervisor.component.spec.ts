import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoSupervisorComponent } from './censo-supervisor.component';

describe('CensoSupervisorComponent', () => {
  let component: CensoSupervisorComponent;
  let fixture: ComponentFixture<CensoSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CensoSupervisorComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CensoSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
