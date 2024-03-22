import { ChatService } from 'src/app/service/chat.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/model/chat';
import { User } from 'src/app/model/user';
import { ClientService } from 'src/app/service/client.service';
import { Page } from 'src/app/service/page';

@Component({
  selector: 'app-add-chats',
  templateUrl: './add-chats.component.html',
  styleUrls: ['./add-chats.component.css']
})
export class AddChatsComponent implements OnInit {
  currentPage: number = 0;
  pageSize: number = 8;
  usernamell!: string ;
  users: any[ ] = [];
  chat: Chat;
  clickedUserId!: number;

  constructor(public dialogRef: MatDialogRef<AddChatsComponent>,@Inject(MAT_DIALOG_DATA) public data:any, private clientService: ClientService, private authService:AuthService, private chatservice: ChatService) {
      this.chat = new Chat;
    }


  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.getAllUsers( );
  }


  getAllUsers( ): void {
    if (this.usernamell) {
      const username = this.usernamell;
      this.clientService.getShortUsers(this.currentPage, this.pageSize,username)
      .subscribe((page: Page<User>) => {
        console.log(page);
        this.users = page.content;
      });
    }
    else {
      const username = this.authService.getUsername();
      this.clientService.getShortUsers(this.currentPage, this.pageSize,username)
      .subscribe((page: Page<User>) => {
        console.log(page);
        this.users = page.content;
      });
    this.usernamell = username;
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  handleUserButtonClick(user: User): void {
    this.clickedUserId = user.id;
    this.createChat();
  }


  createChat(): void {
    const selectedUser = this.users.find(user => user.id === this.clickedUserId);
    if (selectedUser) {
      this.chat.chatname = "New chat";
      const secondId = selectedUser.id;
      const username = this.usernamell;
      this.chatservice.addNewChat(this.chat,  username, secondId ).subscribe((newChat: Chat) => {
        this.getAllUsers();
      });
    }
  }


}
