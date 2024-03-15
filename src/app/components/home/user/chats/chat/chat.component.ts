import { Component} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Track } from 'src/app/model/track';
import { ChatService } from 'src/app/service/chat.service';
import { Message } from 'src/app/model/message';
import { HomeService } from 'src/app/service/home.service';
import { Page } from 'src/app/service/page';
import { PlaylistComponent } from 'src/app/components/dialog/playlist/playlist/playlist.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  selectChat!: Chat;
  messageText!: string;
  pageSize: number = 10;
  messageArray: any[]=[];
  message: Message;
  usernamell!: string;

  constructor(private chatService: ChatService, private homeservice: HomeService, public dialog:MatDialog) {
   this.message = new Message;
  }


  ngOnInit(){
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.chatService.eventEmitter.subscribe(chat=>{
      this.selectChat = chat;
      this.loadMessages(this.selectChat);
      console.log("SelectChat: ", this.selectChat.id);
    });
  }

  loadMessages(chat: Chat): void {
    const chatId = chat.id;

    this.chatService.getAllMessages(chatId,this.pageSize).subscribe((response: Page<Message>) => {
      this.messageArray = response.content;
      console.log('Received messages:', this.messageArray);

      this.messageArray.forEach((message: Message) => {
          const trackId = message.track_id;
          console.log('TrackId for message:', trackId);
          if(trackId !== null && trackId !== 0) {
            this.homeservice.getTrackId(trackId).subscribe((data: Track) => {
              message.track = data;
              console.log(`trackId: ${trackId}, Resulting  track: ${data}`);
            });
          }
          else {
            console.log('TrackId = null');
          }
      });
    });
  }

  createMessages(chat:Chat):void{
    const chatId = this.selectChat.id;
    const messgg =  this.messageText;
    const username = this.usernamell;
    this.chatService.createMessage(this.message, chatId, username,  messgg).subscribe(k => {
      console.log('this chat:',this.selectChat);
      this.loadMessages(chat);
    });
  }

  openPlaylist(): void {
    const dialogRef = this.dialog.open(PlaylistComponent, {
    data: this.selectChat.id
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Changes saved:', result);
      } else {
        console.log('The window is closed without saving changes.');
      }
    });
  }


}

