import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KdsBooleanDialogComponent } from './kds-boolean-dialog.component';

describe('KdsBooleanDialogComponent', () => {
  let component: KdsBooleanDialogComponent;
  let fixture: ComponentFixture<KdsBooleanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KdsBooleanDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KdsBooleanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
