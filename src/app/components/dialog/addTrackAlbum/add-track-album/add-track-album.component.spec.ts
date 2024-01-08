import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrackAlbumComponent } from './add-track-album.component';

describe('AddTrackAlbumComponent', () => {
  let component: AddTrackAlbumComponent;
  let fixture: ComponentFixture<AddTrackAlbumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTrackAlbumComponent]
    });
    fixture = TestBed.createComponent(AddTrackAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
