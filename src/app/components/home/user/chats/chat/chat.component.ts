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

  totalPages: number = 0;
  totalElements: number = 0;

  currentPage: number = 0;
  pageSize: number = 10;

  messageArray: any[]=[];
  track!: Track;



  constructor(private chatService: ChatService, private homeservice: HomeService) {}


  ngOnInit(){
    this.chatService.eventEmitter.subscribe(chat=>{
      this.selectChat = chat;
      this.loadMessages(this.selectChat);
      console.log("SelectChat: " + this.selectChat.id);
    });
  }

  loadMessages(chat: Chat): void {
    const chatId = chat.id;

    this.chatService.getAllMessages(this.currentPage,chatId,this.pageSize).subscribe((response: Page<Message>) => {
      this.messageArray = response.content;
      console.log('Received messages:', this.messageArray);
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;

      this.messageArray.forEach((message: Message) => {
          const trackId = message.track_id;
          console.log('TrackId for message:', trackId);
          if(trackId !== null && trackId !== 0) {
            this.homeservice.getTrackId(trackId).subscribe((data: Track) => {
              this.track = data;
              console.log(`trackId: ${trackId}, Resulting  track: ${data}`);
              message.track = this.track;
            });
          }
          else {
            console.log('TrackId = null');
          }
      });
    });
  }


}

