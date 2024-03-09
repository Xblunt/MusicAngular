import { Track } from './../../../model/track';
import { Chat } from './../../../model/chat';
import { Component } from '@angular/core';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent{
  mess: any[]=[];
  track!: Track;
  selectedChat!: Chat;

 constructor() {}

  selectChat(chat: Chat) {
    this.selectedChat = chat;
  }

  onMessUpdated(mess: any) {
    this.mess = mess;
  }

  onMessTrackUpdated(track: Track) {
    this.track = track;
  }

}




