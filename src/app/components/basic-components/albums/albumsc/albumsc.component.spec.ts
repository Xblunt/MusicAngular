import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumscComponent } from './albumsc.component';

describe('AlbumscComponent', () => {
  let component: AlbumscComponent;
  let fixture: ComponentFixture<AlbumscComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlbumscComponent]
    });
    fixture = TestBed.createComponent(AlbumscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
