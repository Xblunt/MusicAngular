import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAlbumComponent } from './open-album.component';

describe('OpenAlbumComponent', () => {
  let component: OpenAlbumComponent;
  let fixture: ComponentFixture<OpenAlbumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenAlbumComponent]
    });
    fixture = TestBed.createComponent(OpenAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
