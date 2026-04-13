import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSessionsViewerComponent } from './active-sessions-viewer.component';

describe('ActiveSessionsViewerComponent', () => {
  let component: ActiveSessionsViewerComponent;
  let fixture: ComponentFixture<ActiveSessionsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveSessionsViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveSessionsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
