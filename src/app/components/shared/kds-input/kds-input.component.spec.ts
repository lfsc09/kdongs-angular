import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KdsInputComponent } from './kds-input.component';

describe('KdsInputComponent', () => {
  let component: KdsInputComponent;
  let fixture: ComponentFixture<KdsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KdsInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KdsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
