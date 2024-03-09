import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { AddChatsComponent } from 'src/app/components/dialog/addChats/add-chats/add-chats.component';
import { Chat } from 'src/app/model/chat';
import { HomeService } from 'src/app/service/home.service';
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.css']
})
export class ChatsListComponent {
  chats: Chat[] = [];
  usernamell!: string ;
  currentPage: number = 0;
  pageSize: number = 10;
  connected: boolean = false;
  @Output() chatSelected = new EventEmitter<Chat>();
  constructor(private webSocetService: WebSocetServiceService,public dialog:MatDialog, private http: HttpClient, private authService:AuthService,  private homeService: HomeService) {

  }
  selectChat(chat: Chat) {
    this.chatSelected.emit(chat);

  }


  ngOnInit(): void {
    this.webSocetService.activate();
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.getAllUsers();
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

  updatePageSize(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllUsers();
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
          this.homeService.getChats(username).subscribe((data: Chat[]) => {
          this.chats = data;
          });
        }
        else {
          const username = this.authService.getUsername();
          this.homeService.getChats(username).subscribe((data: Chat[]) => {
            this.chats = data;
          });
          this.usernamell = username;
        }
      }
    });
  }

  connectToWebSocket() {
    this.connected = true;

    this.webSocetService.connectToWebSocket();

  }

  disconnectFromWebSocket() {
    this.webSocetService.deactivate();
    this.connected = false;
    // const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
    // audioElement.pause();
  }



}
