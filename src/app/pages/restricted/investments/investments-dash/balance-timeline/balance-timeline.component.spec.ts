import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTimelineComponent } from './balance-timeline.component';

describe('BalanceTimelineComponent', () => {
  let component: BalanceTimelineComponent;
  let fixture: ComponentFixture<BalanceTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
