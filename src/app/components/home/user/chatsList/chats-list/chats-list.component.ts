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
  chats: Chat[] = [];
  // connected: boolean = false;
  authUserId: number;

  constructor(private authService:AuthService, private chatService: ChatService, private webSocetService: WebSocetServiceService){
    this.authUserId = this.authService.getAuthUserId();
    console.log(`userId: ${this.authUserId}`);
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.webSocetService.connectToWebSocket();
  }
  ngOnDestroy(){
    this.webSocetService.disconnectFromWebSocket();
  }

  selectChat(chat: Chat) {
    // if(this.connected == true){
    // this.webSocetService.disconnectFromWebSocket();
    // this.connected = false
    // };
    // this.webSocetService.connectToWebSocket();
    // this.connected = true;
    this.chatService.setSelectChat(chat);
    console.log("SelectChat: " + chat.id);
  }


  getAllUsers( ): void {
    if (this.authUserId) {
      const authUserId = this.authUserId;
        this.chatService.getChats(authUserId).subscribe((data: Chat[]) => {
          this.chats = data;
        });
    }
  }

}
