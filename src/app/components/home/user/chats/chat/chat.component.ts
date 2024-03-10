import { Component} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { ChatService } from 'src/app/service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  selectChat!: Chat;
  messageText!: string;


  constructor(private chatService: ChatService){
    this.chatService.ee.subscribe(chat=>{
      this.selectChat = chat;
      console.log(chat);
    });
  }



}

