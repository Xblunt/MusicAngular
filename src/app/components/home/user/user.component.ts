import { Observable, Subscription } from 'rxjs';
import { Track } from './../../../model/track';
import { Chat } from './../../../model/chat';
import { HomeService } from 'src/app/service/home.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Page } from 'src/app/service/page';
import { CredentialResponse } from 'src/app/auth/model/auth/credentialResponse';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { MatTable} from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddChatsComponent } from '../../dialog/addChats/add-chats/add-chats.component';
import { PlaylistComponent } from '../../dialog/playlist/playlist/playlist.component';
import { Message } from 'src/app/model/message';

import { Session } from 'src/app/model/session';
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],

})
export class UserComponent implements  AfterViewInit{
  sessionDataSubscription!: Subscription;
  usernamell!: string ;
  name!: string;
  currentPage: number = 0;
  pageSize: number = 10;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user!: CredentialResponse;
  fromUserComponent: boolean = true;
  chats: any[] = [];
  mess: any[]=[];
  tracks: Track[]=[];
  chat!: Chat;
  track!: Track;
  message: Message;
  messageText!: string;
  selectedChat!: number;
  secondid!:number;
  firstid!:number;
  data!: Session;
  TimeOnDeviceConnect!: number;
  connected: boolean = false;

 constructor(private webSocetService: WebSocetServiceService,public dialog:MatDialog, private http: HttpClient, private authService:AuthService,  private homeService: HomeService) {
    this.message = new Message;
  }

  @ViewChild('myAudioElement') audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild('myButton') buttonElement!: ElementRef;



  ngAfterViewInit(): void {
    this.user = this.authService.LoggedUser;
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

  // ViewMessages(): void {
  //   const chatId = this.selectedChat;
  //   this.homeService.getAllMessages(this.currentPage,chatId,this.pageSize,this.sortColumn,this.sortDirection).subscribe((response: Page<Message>) => {
  //     this.mess = response.content;
  //     this.totalElements = response.totalElements;
  //     this.totalPages = response.totalPages;
  //     this.length = response.content.length;
  //   });
  // }


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


  LoadMessages(chat: Chat): void {

    const chatId = chat.id;
    this.selectedChat = chat.id;
    this.secondid = chat.second_id;
    this.firstid = chat.first_id;
    console.log("first:"  +  this.firstid);
    console.log("sec:"  +  this.secondid);

    this.homeService.getAllMessages(this.currentPage,chatId,this.pageSize,this.sortColumn,this.sortDirection).subscribe((response: Page<Message>) => {
      this.mess = response.content;
      console.log('Received messages:', this.mess);
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;
      this.length = response.content.length;

      this.mess.forEach((message: Message) => {
          const trackId = message.track_id;
          console.log('TrackId for message:', trackId);
          if(trackId !== null && trackId !== 0) {
            this.homeService.getTrackId(trackId).subscribe((ttt: Track) => {
              this.track = ttt;
              console.log('trackkk', trackId);
              console.log('trackmass', ttt);
              message.track = this.track;
            });
          }
          else {
            console.log('Trackid = null');
          }
      });
    });
  }


  CreateMessages(chat:Chat):void{
    const chatId = this.selectedChat;
    const messgg =  this.messageText;
    const username = this.usernamell;
    this.homeService.createMessage(this.message, chatId, username,  messgg).subscribe(k => {
      console.log('this chat',this.chat);
      this.LoadMessages(this.chat);
    });
  }


  OpenPlaylist(): void {
    const dialogRef = this.dialog.open(PlaylistComponent, {
    data: this.selectedChat
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Изменения сохранены:', result);
      } else {
        console.log('Окно закрыто без сохранения изменений.');
      }
    this.LoadMessages(this.chat);
    });
  }


  playAudio() {
    const chatId = this.selectedChat;
    const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
    console.log("PLAAAAY");
    console.log("Current time plaaaayy:", audioElement.currentTime);

    const currentTime = audioElement.currentTime * 1000;
    const action = true;
    const pause = false;
    const currentTimeOnDevice = Date.now();
    console.log("Время пользователя при запуске трека",currentTimeOnDevice);

    this.webSocetService.updateSession(currentTime, action, chatId,pause, currentTimeOnDevice);

    this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
      audioElement.currentTime = sessionData.time/1000;
      audioElement.play();
  });

  }


  pauseAudio() {
    const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
    const chatId = this.selectedChat;
    audioElement.pause();

    const pause = true;
    const currentTime = audioElement.currentTime * 1000;
    const action = false;
    const currentTimeOnDevice = Date.now();
    console.log("Время пользователя при остановке трека",currentTimeOnDevice);

    this.webSocetService.updateSession(currentTime, action, chatId,pause, currentTimeOnDevice);
    console.log("STOOOOP");
    console.log("Current time stooop:", audioElement.currentTime);
    this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
      audioElement.currentTime = sessionData.time/1000;
      audioElement.pause();
  });
  }


  playTrackafterConnect(){

    this.TimeOnDeviceConnect = Date.now();

    console.log("Время пользователя при подклбчении",  this.TimeOnDeviceConnect );
    const audioElement = this.audioElement.nativeElement as HTMLAudioElement;

    this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {

      console.log("data from server:", sessionData);

      console.log("data from server:", sessionData.action);
      if( sessionData.action === true){
        this.TimeOnDeviceConnect = Date.now();
        audioElement.currentTime = sessionData.time + ((this.TimeOnDeviceConnect/1000 - sessionData.currentTimeOnDevice/1000));
        audioElement.play();
       }
      else if (sessionData.action === false){
        const timepause = sessionData.time / 1000;
        audioElement.currentTime = timepause;
        console.log("ata.time stop",audioElement.currentTime );
        audioElement.pause();
        }
      else {
        console.log("Need play and stop")
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
    const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
    audioElement.pause();
  }


  update(): void {
    // this.webSocetServiceService.activate();
    // this.webSocetServiceService.connectToWebSocket();
    // this.connected = true;
    console.log("update" );
    const chatId = this.selectedChat;
    console.log("update chatId", chatId);
    const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
    this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
      console.log("data from server:", sessionData);
      console.log("data from server:", sessionData.action);
      if( sessionData.action === true){
        this.TimeOnDeviceConnect = Date.now();
        audioElement.currentTime = sessionData.time + ((this.TimeOnDeviceConnect/1000 - sessionData.currentTimeOnDevice/1000));
        audioElement.play();
        }
        else if (sessionData.action === false){
          const timepause = sessionData.time / 1000;
          audioElement.currentTime = timepause;
          console.log("ata.time stop",audioElement.currentTime );
          audioElement.pause();
          }
        else {

          console.log("Need play and stop")
        }
      });
  }


}
          // seekAudio(event: Event) {
          //   const audioElement = event.target as HTMLAudioElement;

          //   // console.log("Current time:", time);
          //   const chatId = this.selectedChat;
          //   const currentTime = audioElement.currentTime * 1000;
          //   const action = 'play';
          //   const pause = false;

          //   this.webSocetServiceService.updateSession(currentTime, action, chatId,pause);
          // }
          // setAudioTime() {
          //   const timeInput = document.getElementById('timeInput') as HTMLInputElement;
          //   const time = Number(timeInput.value);
          //   const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
          //   audioElement.currentTime  = time;
          //   console.log(`Set audio time: ${time}, current`);
          //   console.log("Current time set:", audioElement.currentTime);
          // }

          // }




