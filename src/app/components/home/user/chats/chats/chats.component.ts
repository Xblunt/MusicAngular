import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/model/chat';
import { HomeService } from 'src/app/service/home.service';
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Message } from 'src/app/model/message';
import { Page } from 'src/app/service/page';
import { PlaylistComponent } from 'src/app/components/dialog/playlist/playlist/playlist.component';
import { Track } from 'src/app/model/track';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  // selectedChat!: number;
  secondid!:number;
  firstid!:number;
  usernamell!: string ;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  currentPage: number = 0;
  pageSize: number = 10;
  mess: any[]=[];
  track!: Track;
  message: Message;
  messageText!: string;
  @Input() chat!: Chat;
  @Output() messUpdated = new EventEmitter<any>();
  @Output() messTrackUpdated = new EventEmitter<any>();
  // @Output() chatS= new EventEmitter<Chat>();
  // @Input() selectChat!: Chat | null;
  constructor(private webSocetService: WebSocetServiceService,public dialog:MatDialog, private http: HttpClient, private authService:AuthService,  private homeService: HomeService) {
    this.message = new Message;
  }
  ngOnInit(): void {

    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.LoadMessages(this.chat);
  }


  LoadMessages(chat: Chat): void {
    const chatId = chat.id;
    // this.selectedChat = chat.id;
    this.secondid = chat.second_id;
    this.firstid = chat.first_id;
    console.log("first:"  +  this.firstid);
    console.log("sec:"  +  this.secondid);

    this.homeService.getAllMessages(this.currentPage,chatId,this.pageSize,this.sortColumn,this.sortDirection).subscribe((response: Page<Message>) => {
      this.mess = response.content;
      this.messUpdated.emit(this.mess);
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
              this.messTrackUpdated.emit(this.track);
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
    // if(this.selectedChat){
    const chatId = this.chat.id;
    const messgg =  this.messageText;
    const username = this.usernamell;
    this.homeService.createMessage(this.message, chatId, username,  messgg).subscribe(k => {
      console.log('this chat',this.chat);
      this.LoadMessages(chat);
    });
  }


  OpenPlaylist(): void {
    const dialogRef = this.dialog.open(PlaylistComponent, {
    data: this.chat.id
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Изменения сохранены:', result);
      } else {
        console.log('Окно закрыто без сохранения изменений.');
      }
    });
  }

}
