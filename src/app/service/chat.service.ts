import { EventEmitter, Injectable } from '@angular/core';
import { Chat } from '../model/chat';
import { Track } from '../model/track';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  ee: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  setSelectChat(selectedChat: Chat) {
    this.ee.emit(selectedChat);
  }


}
