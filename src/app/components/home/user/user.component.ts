import { Track } from 'src/app/model/track';
import { Chat } from './../../../model/chat';
import { HomeService } from 'src/app/service/home.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import {MatGridListModule} from '@angular/material/grid-list';
import { EditComponent } from '../../dialog/edit-component/edit/edit.component';
import { User } from 'src/app/model/user';
import { DeleteComponentComponent } from '../../dialog/delete-component/delete-component/delete-component.component';
import { Page } from 'src/app/service/page';
import { CredentialResponse } from 'src/app/auth/model/auth/credentialResponse';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddChatsComponent } from '../../dialog/addChats/add-chats/add-chats.component';
import { PlaylistComponent } from '../../dialog/playlist/playlist/playlist.component';
import { Message } from 'src/app/model/message';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],

})
export class UserComponent implements  AfterViewInit{



  // displayedColumns: string[] = ['id', 'fio',  'action'];


  // dataSource4 = new MatTableDataSource<User>();

  usernamell!: string ;
  currentPage: number = 0;
  pageSize: number = 100;
  // active: string = 'user_id';
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user!: CredentialResponse;
  fromUserComponent: boolean = true;
chats: any[] = [];
mess: any[]=[];
tracks: any[]=[];
chat!: Chat;
message: Message;
messageText!: string;
selectedChat!: number;
secondid!:number;
firstid!:number;
 constructor(private baseService: BaseServiceService, private _liveAnnouncer: LiveAnnouncer,
    public dialog:MatDialog, private http: HttpClient, private authService:AuthService, private adminService:AdminServiceService, private homeService: HomeService) {
      // this.baseService.getAllStudents().subscribe(data => this.dataSource = new MatTableDataSource(data));
 this.message = new Message;
    }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild('myButton') buttonElement!: ElementRef;

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.user = this.authService.LoggedUser;
  }
  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    const trackfile = localStorage.getItem('trackId');

    this.getAllUser();


  }
  openChat(chat:Chat){

    console.log(chat);
  }
  someMethod() {
    this.trigger.openMenu();
  }
    getAllUser( ): void {
      if (this.usernamell) {
        const username = this.usernamell;


        this.homeService.getChats(

          username

        ).subscribe((data: Chat[]) => {

          console.log( data);
          console.log('Before assigning chats:', this.chats);
console.log('Before assigning page.content:', data);
          this.chats = data;


console.log('After assigning chats:', this.chats);
console.log('After assigning page.content:', data);


        });

      } else {
        const username = this.authService.getUsername();

        this.homeService.getChats(

          username

        ).subscribe((data: Chat[]) => {

          console.log( data);
          console.log('Before assigning chats:', this.chats);
console.log('Before assigning page.content:', data);
          this.chats = data;


console.log('After assigning chats:', this.chats);
console.log('After assigning page.content:', data);


        });

        this.usernamell = username;

      }}


    updatePageSize(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.getAllUser();
    }

    addChat() {
      const dialogAddingNewStudent = this.dialog.open(AddChatsComponent, {
        width: '700px',
        data: null
      });
      dialogAddingNewStudent.afterClosed().subscribe((result: Chat) => {
        if(result != null) {
          console.log("adding new student: " + result.id);
          if (this.usernamell) {
            const username = this.usernamell;


            this.homeService.getChats(

              username

            ).subscribe((data: Chat[]) => {

              console.log( data);
              console.log('Before assigning chats:', this.chats);
    console.log('Before assigning page.content:', data);
              this.chats = data;


    console.log('After assigning chats:', this.chats);
    console.log('After assigning page.content:', data);


            });

          } else {
            const username = this.authService.getUsername();

            this.homeService.getChats(

              username

            ).subscribe((data: Chat[]) => {

              console.log( data);
              console.log('Before assigning chats:', this.chats);
    console.log('Before assigning page.content:', data);
              this.chats = data;


    console.log('After assigning chats:', this.chats);
    console.log('After assigning page.content:', data);


            });

            this.usernamell = username;

          }}

          });}
          changeButtonColor(button: HTMLElement): void {
            // Удаляем класс 'panel-gray' и добавляем класс 'panel-green' для изменения цвета кнопки
            button.classList.remove('.panel-gray');
            button.classList.add('.panel-green');

            // Получаем все кнопки с классом 'panel-gray'
            const grayButtons: NodeListOf<HTMLElement> = document.querySelectorAll('.panel-gray');

            // Перебираем все кнопки и удаляем класс 'panel-green' в случае, если он есть
            grayButtons.forEach((grayButton: HTMLElement) => {
              grayButton.classList.remove('.panel-green');
            });
          }

          loadMessage(chat: Chat): void {
            const chatId = chat.id;
            this.selectedChat = chat.id;
            this.secondid = chat.second_id;
            this.firstid = chat.first_id;
            console.log("first:"  +  this.firstid);
            console.log("sec:"  +  this.secondid);
            this.homeService.getAllMess(
              this.currentPage,
              chatId,
              this.pageSize,
              this.sortColumn,
              this.sortDirection
            ).subscribe((response: Page<Chat>) => {
              this.mess = response.content;
              this.totalElements = response.totalElements;
              this.totalPages = response.totalPages;
              this.length = response.content.length;
            });
          }

          Createmess(chat:Chat):void{
            const chatId = this.selectedChat;
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaa:::'+ chatId)
           const messgg =  this.messageText;
          const username = this.usernamell;
           console.log("second"+this.message.second);
           console.log('aaaaaaaaaaaaaaaaaaaaaaaaa:::'+ messgg)
           this.homeService.createMess(this.message, chatId, username,  messgg).subscribe(
            k => {
              this.homeService.getAllMess(
                this.currentPage,
                chatId,
                this.pageSize,
                this.sortColumn,
                this.sortDirection
              ).subscribe((response: Page<Chat>) => {
                this.mess = response.content;
                this.totalElements = response.totalElements;
                this.totalPages = response.totalPages;
                this.length = response.content.length;
              });

            });



          }
          OpenPlay(): void {
            const dialogRef = this.dialog.open(PlaylistComponent, {
              data: this.selectedChat
            });

            dialogRef.afterClosed().subscribe((result: any) => {
              if (result) {
                console.log('Изменения сохранены:', result);
              } else {
                console.log('Окно закрыто без сохранения изменений.');
              }
            });
          }
          //   updatePageSizeTrackss(event: PageEvent): void {
          //   this.pageSize = event.pageSize;
          //   this.currentPage = event.pageIndex;
          //   this.loadMessage();
          // }
          }




