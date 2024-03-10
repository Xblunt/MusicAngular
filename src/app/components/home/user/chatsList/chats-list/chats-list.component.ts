import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/model/chat';
import { HomeService } from 'src/app/service/home.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.css']
})
export class ChatsListComponent {
  usernamell!: string ;
  chats: Chat[] = [];

  @Output() chatSelected = new EventEmitter<Chat>();

  constructor(private authService:AuthService, private homeService: HomeService){

  }

  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.getAllUsers();
  }

  selectChat(chat: Chat) {
    this.chatSelected.emit(chat);
  }

  getAllUsers( ): void {
    if (this.usernamell) {
      const username = this.usernamell;
        this.homeService.getChats(username).subscribe((data: Chat[]) => {
          this.chats = data;
        });
    }
    else {
      const username = this.authService.getUsername();
      this.homeService.getChats( username).subscribe((data: Chat[]) => {
          this.chats = data;
        });
      this.usernamell = username;
      }
    }

}
