import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NopagefoundComponent } from './nopagefound.component';

describe('NopagefoundComponent', () => {
  let component: NopagefoundComponent;
  let fixture: ComponentFixture<NopagefoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NopagefoundComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NopagefoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
