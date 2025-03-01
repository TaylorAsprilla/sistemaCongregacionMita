import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamposComponent } from './campos.component';

describe('CamposComponent', () => {
  let component: CamposComponent;
  let fixture: ComponentFixture<CamposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CamposComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
