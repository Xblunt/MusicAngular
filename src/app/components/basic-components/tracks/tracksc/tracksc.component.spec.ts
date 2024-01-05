import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackscComponent } from './tracksc.component';

describe('TrackscComponent', () => {
  let component: TrackscComponent;
  let fixture: ComponentFixture<TrackscComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackscComponent]
    });
    fixture = TestBed.createComponent(TrackscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
