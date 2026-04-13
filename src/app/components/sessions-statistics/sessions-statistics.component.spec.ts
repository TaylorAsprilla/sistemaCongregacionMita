import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsStatisticsComponent } from './sessions-statistics.component';

describe('SessionsStatisticsComponent', () => {
  let component: SessionsStatisticsComponent;
  let fixture: ComponentFixture<SessionsStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsStatisticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
