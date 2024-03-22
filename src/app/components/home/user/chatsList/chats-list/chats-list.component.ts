import { ChatService } from './../../../../../service/chat.service';
import { Component} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/model/chat';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.css']
})
export class ChatsListComponent {
  usernamell!: string ;
  chats: Chat[] = [];

  constructor(private authService:AuthService, private chatService: ChatService){

  }

  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.getAllUsers();
  }

  selectChat(chat: Chat) {
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
