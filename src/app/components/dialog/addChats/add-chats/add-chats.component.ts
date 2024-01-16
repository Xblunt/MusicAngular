import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { HomeComponent } from 'src/app/components/home/home/home.component';
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
  // active: string = 'user_id';
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  usernamell!: string ;
  users: any[ ] = [];
  chat: Chat;
  clickedUserId!: number;
  constructor(public dialogRef: MatDialogRef<AddChatsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any, private formBuilder: FormBuilder, private homeservice: HomeService,  private authService:AuthService) { this.chat = new Chat;}


    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.getAllUser( );
    // throw new Error('Method not implemented.');
  }
  getAllUser( ): void {
    if (this.usernamell) {
      const username = this.usernamell;

    this.homeservice.getAllUsers(this.currentPage, this.pageSize,username,  this.sortColumn,this.sortDirection)
      .subscribe((page: Page<User>) => {
        console.log(page);
        this.users = page.content;

        this.totalPages = page.totalPages;


        this.totalElements = page.totalElements;





      });

  } else {
  const username = this.authService.getUsername();
  this.homeservice.getAllUsers(this.currentPage, this.pageSize,username,  this.sortColumn,this.sortDirection)
  .subscribe((page: Page<User>) => {
    console.log(page);
    this.users = page.content;

    this.totalPages = page.totalPages;


    this.totalElements = page.totalElements;





  });
  this.usernamell = username;
} }

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
   console.log(username);
   console.log(this.chat);
   console.log(this.chat.chatname);
   console.log(this.chat.second_id);
   console.log(this.chat.first_id);
    this.homeservice.addNewChat(this.chat,  username, secondId ).subscribe((newChat: Chat) => {
      this.getAllUser();
    });
  }
}
}
