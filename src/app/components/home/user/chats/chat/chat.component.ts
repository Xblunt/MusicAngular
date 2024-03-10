import { Component, EventEmitter, Input } from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { ChatService } from 'src/app/service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  chatSelected!: EventEmitter<Chat>;
  selectChat!: Chat;


  constructor(private chatService: ChatService){
    this.chatService.ee.subscribe(chat=>{
      this.selectChat = chat;
      console.log(chat);
    });
  }








}
