import { MusicService } from './../../../../../service/music.service';
import { Component} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Track } from 'src/app/model/track';
import { ChatService } from 'src/app/service/chat.service';
import { Message } from 'src/app/model/message';
import { ClientService } from 'src/app/service/client.service';
import { Page } from 'src/app/service/page';
import { PlaylistComponent } from 'src/app/components/dialog/playlist/playlist/playlist.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';


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
  authUserId:number;



  constructor(private chatService: ChatService, private clientService: ClientService, public dialog:MatDialog, public musicService: MusicService, private authService: AuthService) {
   this.message = new Message;
   this.authUserId = this.authService.getAuthUserId();
   console.log(`userId: ${this.authUserId}`);
  }



  ngOnInit(){
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
          const trackId = message.track.id;
          console.log('TrackId for message:', trackId);

          /*
          if(trackId !== null && trackId !== 0) {
            this.clientService.getTrackId(trackId).subscribe((data: Track) => {
              message.track = data;
              console.log(`trackId: ${trackId}, Resulting  track: ${data}`);
            });
          }
          else {
            console.log('TrackId = null');
          }*/
      });
    });
  }

  createMessages(chat:Chat):void{
    const chatId = this.selectChat.id;
    const messgg =  this.messageText;
    const authUserId = this.authUserId;
    this.chatService.createMessage(this.message, chatId, authUserId,  messgg).subscribe(k => {
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

  playAudio(track: Track) {
    this.musicService.playAudio(track.file, track.id, this.selectChat);
    console.log("PlayAudio Chat");
  }

  pauseAudio(track:Track) {
    this.musicService.pauseAudio(track.id,this.selectChat);
    console.log("PauseAudio Chat");
  }

}

