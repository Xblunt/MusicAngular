import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChatsComponent } from './add-chats.component';

describe('AddChatsComponent', () => {
  let component: AddChatsComponent;
  let fixture: ComponentFixture<AddChatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddChatsComponent]
    });
    fixture = TestBed.createComponent(AddChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
