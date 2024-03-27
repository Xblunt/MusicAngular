import { ChatService } from './../../../../../service/chat.service';
import { Component} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/model/chat';
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.css']
})
export class ChatsListComponent {
  usernamell!: string ;
  chats: Chat[] = [];
  connected: boolean = false;

  constructor(private authService:AuthService, private chatService: ChatService, private webSocetService: WebSocetServiceService){

  }

  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.getAllUsers();
  }

  selectChat(chat: Chat) {
    if(this.connected == true){
    this.webSocetService.disconnectFromWebSocket();
    this.connected = false
    };
    this.webSocetService.connectToWebSocket();
    this.connected = true;
    this.chatService.setSelectChat(chat);
    console.log("SelectChat: " + chat.id);
  }


  getAllUsers( ): void {
    if (this.usernamell) {
      const username = this.usernamell;
        this.chatService.getChats(username).subscribe((data: Chat[]) => {
          this.chats = data;
        });
    }
    else {
      const username = this.authService.getUsername();
      this.chatService.getChats( username).subscribe((data: Chat[]) => {
          this.chats = data;
      });
      this.usernamell = username;
      }
    }

}
