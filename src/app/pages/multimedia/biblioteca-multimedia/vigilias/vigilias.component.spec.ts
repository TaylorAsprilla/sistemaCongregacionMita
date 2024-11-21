import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VigiliasComponent } from './vigilias.component';

describe('VigiliasComponent', () => {
  let component: VigiliasComponent;
  let fixture: ComponentFixture<VigiliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VigiliasComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(VigiliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
