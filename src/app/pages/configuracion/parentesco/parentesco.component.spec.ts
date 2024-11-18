import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentescoComponent } from './parentesco.component';

describe('ParentescoComponent', () => {
  let component: ParentescoComponent;
  let fixture: ComponentFixture<ParentescoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParentescoComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ParentescoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
