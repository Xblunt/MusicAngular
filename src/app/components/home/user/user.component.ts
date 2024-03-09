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
  // chat!: Chat;
  track!: Track;
  message: Message;
  messageText!: string;
  // selectedChat!: number;
  secondid!:number;
  firstid!:number;
  data!: Session;
  TimeOnDeviceConnect!: number;
  messComponents: any;
  currentPage: number = 0;
  pageSize: number = 10;
  selectedChat: Chat | null = null;


 constructor(private webSocetService: WebSocetServiceService,public dialog:MatDialog, private http: HttpClient, private authService:AuthService,  private homeService: HomeService) {
    this.message = new Message;
  }

  @ViewChild('myAudioElement') audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild('myButton') buttonElement!: ElementRef;

  selectChat(chat: Chat) {
    this.selectedChat = chat;
  }

  ngAfterViewInit(): void {
    this.user = this.authService.LoggedUser;
  }
  onMessUpdated(mess: any) {
    this.mess = mess;
  }
  onMessTrackUpdated(track: Track) {
    this.track = track;
  }


  // playTrackafterConnect(){

  //   this.TimeOnDeviceConnect = Date.now();

  //   console.log("Время пользователя при подклбчении",  this.TimeOnDeviceConnect );
  //   const audioElement = this.audioElement.nativeElement as HTMLAudioElement;

  //   this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {

  //     console.log("data from server:", sessionData);

  //     console.log("data from server:", sessionData.action);
  //     if( sessionData.action === true){
  //       this.TimeOnDeviceConnect = Date.now();
  //       audioElement.currentTime = sessionData.time + ((this.TimeOnDeviceConnect/1000 - sessionData.currentTimeOnDevice/1000));
  //       audioElement.play();
  //      }
  //     else if (sessionData.action === false){
  //       const timepause = sessionData.time / 1000;
  //       audioElement.currentTime = timepause;
  //       console.log("ata.time stop",audioElement.currentTime );
  //       audioElement.pause();
  //       }
  //     else {
  //       console.log("Need play and stop")
  //     }
  // });
  // }



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




