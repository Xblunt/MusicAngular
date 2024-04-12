import { MusicService } from 'src/app/service/music.service';
import { Component} from '@angular/core';
import { Chat } from 'src/app/model/chat';
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
  selectChat: Chat;
  messageText: string;
  pageSize: number = 10;
  messageArray: any[]=[];
  message: Message;
  authUserId:number;



  constructor(private chatService: ChatService, private clientService: ClientService, public dialog:MatDialog,  private authService: AuthService, private musicService: MusicService) {
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

  playAudio(track: string) {
    this.musicService.setCurrentTrack(track);
    this.musicService.playAudio(track, this.selectChat);
    console.log("PlayAudio Chat");
  }

  pauseAudio(track:string) {
    this.musicService.pauseAudio(track,this.selectChat);
    console.log("PauseAudio Chat");
  }

}

