import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/model/chat';
import { User } from 'src/app/model/user';
import { HomeService } from 'src/app/service/home.service';
import { Page } from 'src/app/service/page';

@Component({
  selector: 'app-add-chats',
  templateUrl: './add-chats.component.html',
  styleUrls: ['./add-chats.component.css']
})
export class AddChatsComponent implements OnInit {

  currentPage: number = 0;
  pageSize: number = 8;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;

  usernamell!: string ;
  users: any[ ] = [];
  chat: Chat;
  clickedUserId!: number;

  constructor(public dialogRef: MatDialogRef<AddChatsComponent>,@Inject(MAT_DIALOG_DATA) public data:any, private homeservice: HomeService, private authService:AuthService) {
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
      this.homeservice.getAllUsers(this.currentPage, this.pageSize,username,  this.sortColumn,this.sortDirection)
      .subscribe((page: Page<User>) => {
        console.log(page);
        this.users = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
      });
    }
    else {
      const username = this.authService.getUsername();
      this.homeservice.getAllUsers(this.currentPage, this.pageSize,username,  this.sortColumn,this.sortDirection)
      .subscribe((page: Page<User>) => {
        console.log(page);
        this.users = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
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
      this.homeservice.addNewChat(this.chat,  username, secondId ).subscribe((newChat: Chat) => {
        this.getAllUsers();
      });
    }
  }


}
