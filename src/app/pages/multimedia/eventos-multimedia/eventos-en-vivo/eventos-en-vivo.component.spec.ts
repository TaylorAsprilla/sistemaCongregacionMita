import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosEnVivoComponent } from './eventos-en-vivo.component';

describe('EventosEnVivoComponent', () => {
  let component: EventosEnVivoComponent;
  let fixture: ComponentFixture<EventosEnVivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EventosEnVivoComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(EventosEnVivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
