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
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Session } from 'src/app/model/session';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],

})
export class UserComponent implements  AfterViewInit{

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

 constructor(private webSocetServiceService: WebSocetServiceService,public dialog:MatDialog, private http: HttpClient, private authService:AuthService,  private homeService: HomeService) {
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

  ViewMessages(): void {
    const chatId = this.selectedChat;
    this.homeService.getAllMessages(this.currentPage,chatId,this.pageSize,this.sortColumn,this.sortDirection).subscribe((response: Page<Chat>) => {
      this.mess = response.content;
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;
      this.length = response.content.length;
    });
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
      this.ViewMessages();
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



















          oneplay: number = 1;
          // playAudio() {
          //   const chatId = this.selectedChat;
          //   console.log("chatId playtrack", chatId);

          //   const audioElement = this.audioElement.nativeElement as HTMLAudioElement;

          //   // if (this.oneplay == 1) {
          //     audioElement.play();
          //     // this.oneplay = 0;
          //     console.log("PLAAAAY");
          //     console.log("Current time plaaaayy:", audioElement.currentTime);


          //     const currentTime = audioElement.currentTime;
          //     const action = 'play';
          //     this.webSocetServiceService.updateSession(currentTime, action, chatId);
          //   // } else {
          //   //   this.pauseAudio();
          //   // }
          // }
           updateSessionCalled: boolean = false;
          playAudio() {
            // let updateSessionCalled = false;
            if(this.updateSessionCalled === false){
            const chatId = this.selectedChat;
            console.log("chatId playtrack", chatId);

            const audioElement = this.audioElement.nativeElement as HTMLAudioElement;

            console.log("PLAAAAY");
            console.log("Current time plaaaayy:", audioElement.currentTime);

            const currentTime = audioElement.currentTime;
            const action = 'play';
            const pause = false;
            this.updateSessionCalled = true;

            this.webSocetServiceService.updateSession(currentTime, action, chatId,pause);



            audioElement.play();;
            }
          }

              // playAudio() {
              //   this.webSocetServiceService.getData().subscribe((data) => {
              //     // здесь вы получите обновления данных и можете их использовать в вашем компоненте
              //     console.log("Received data in component:", data);
              //   });
              // }


          connected: boolean = false;
          connectToWebSocket() {
            this.webSocetServiceService.activate();


            this.connected = true;
            const chatId = this.selectedChat;
            const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
            this.webSocetServiceService.getData().subscribe((session)=> {
              console.log("session get",session );
           if(session.action === "play"){

            audioElement.currentTime = session.time;
            audioElement.play();

           }
          else if (session.action === "stop"){
            audioElement.currentTime = session.time;
            audioElement.pause();

            }

            else {

              console.log("Need play and stop")
            }

            })
          // this.update();
          }

          nullSession(){
            const chatId = this.selectedChat;
            const currentTime = 0;
            const action = "null";
            const pause = false;
            this.webSocetServiceService.updateSession(currentTime, action, chatId,pause);
          }

          update() {
            console.log("update" );
            const chatId = this.selectedChat;
            const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
            this.homeService.getSession(chatId).subscribe((data: Session)=> {
              console.log("session get",data );
           if(data.action === "play"){

            audioElement.currentTime = data.time + 0.2;
            audioElement.play();
            data.action = "play";
            data.pause = false;
           }
          else if (data.action === "stop"){
            audioElement.currentTime = data.time;
            audioElement.pause();

            data.action = "stop";
            }
            else if (data.pause === true){
              audioElement.currentTime = data.time;
              audioElement.pause();
              data.action = "stop";

              }
            else {

              console.log("Need play and stop")
            }

            })
          }
          disconnectFromWebSocket() {
            this.webSocetServiceService.deactivate();
            this.connected = false;
            const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
            audioElement.pause();
          }
          pauseAudio() {

           if (this.updateSessionCalled === true){
            const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
            const chatId = this.selectedChat;

            audioElement.pause();
            const pause = true;

            this.updateSessionCalled = false;
              const currentTime = audioElement.currentTime;
              const action = 'stop';
              this.webSocetServiceService.updateSession(currentTime, action, chatId,pause);



            console.log("STOOOOP");
            console.log("Current time stooop:", audioElement.currentTime);
}
          }
          seekAudio(event: Event) {
            const audioElement = event.target as HTMLAudioElement;

            // console.log("Current time:", time);
            const chatId = this.selectedChat;
            const currentTime = audioElement.currentTime;
            const action = 'play';
            const pause = false;

            this.webSocetServiceService.updateSession(currentTime, action, chatId,pause);
          }
          setAudioTime() {
            const timeInput = document.getElementById('timeInput') as HTMLInputElement;
            const time = Number(timeInput.value);
            const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
            audioElement.currentTime = time;
            console.log(`Set audio time: ${time}, current`);
            console.log("Current time set:", audioElement.currentTime);
          }

          }




