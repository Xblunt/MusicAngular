import { MatDialog } from '@angular/material/dialog';
import { ChatService } from './../../../../../service/chat.service';
import { Component} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AddChatsComponent } from 'src/app/components/dialog/addChats/add-chats/add-chats.component';
import { Chat } from 'src/app/model/chat';
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.css']
})
export class ChatsListComponent {
  chats: Chat[] = [];
  authUserId: number;

  constructor(private authService:AuthService, private chatService: ChatService, private webSocetService: WebSocetServiceService,public dialog:MatDialog){
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
    this.chatService.setSelectChat(chat);
    console.log("SelectChat: " + chat.id);
  }


  getAllUsers( ): void {
    if (this.authUserId) {
        this.chatService.getChats(this.authUserId).subscribe((data: Chat[]) => {
          this.chats = data;
        });
    }
  }

  addChat() {
    const dialogAddingNewStudent = this.dialog.open(AddChatsComponent, {
      width: '700px',
      data: null
    });
    dialogAddingNewStudent.afterClosed().subscribe((result: Chat) => {
      if(result != null) {
        console.log("adding new chat: " + result.id);
      }
    });
  }

}
