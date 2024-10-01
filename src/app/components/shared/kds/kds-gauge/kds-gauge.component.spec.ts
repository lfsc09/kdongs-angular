import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KdsGaugeComponent } from './kds-gauge.component';

describe('KdsGaugeComponent', () => {
  let component: KdsGaugeComponent;
  let fixture: ComponentFixture<KdsGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KdsGaugeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KdsGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
