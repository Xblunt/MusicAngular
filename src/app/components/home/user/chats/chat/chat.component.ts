import { Component} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Track } from 'src/app/model/track';
import { ChatService } from 'src/app/service/chat.service';
import { Message } from 'src/app/model/message';
import { HomeService } from 'src/app/service/home.service';
import { Page } from 'src/app/service/page';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  selectChat!: Chat;
  messageText!: string;
  secondid!:number;
  firstid!:number;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  currentPage: number = 0;
  pageSize: number = 10;
  mess: any[]=[];
  track!: Track;



  constructor(private chatService: ChatService, private homeService: HomeService){
    this.chatService.ee.subscribe(chat=>{
      this.selectChat = chat;
      this.LoadMessages(this.selectChat);
      console.log(this.selectChat);
    });

  }


  LoadMessages(chat: Chat): void {
    console.log("chchhc   " + this.selectChat.id);
    const chatId = chat.id;
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


}

