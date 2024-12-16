import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceGroupComponent } from './performance-group.component';

describe('PerformanceGroupComponent', () => {
  let component: PerformanceGroupComponent;
  let fixture: ComponentFixture<PerformanceGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
