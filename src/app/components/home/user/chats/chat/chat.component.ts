import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
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
  check: boolean = false;



  constructor(private chatService: ChatService, private clientService: ClientService, public dialog:MatDialog,
    private authService: AuthService, private musicService: MusicService, private webSocetServiceService:WebSocetServiceService
  ) {
   this.message = new Message;
   this.authUserId = this.authService.getAuthUserId();
   console.log(`userId: ${this.authUserId}`);
  }

  ngOnInit(){
    this.chatService.eventEmitter.subscribe(chat=>{
      this.selectChat = chat;
      this.loadMessages(this.selectChat);
      console.log("SelectChat: ", this.selectChat.id);
      if(this.check == true){
        this.webSocetServiceService.disconnectFromWebSocket();
        this.check = false
        };
        this.webSocetServiceService.connectToWebSocket();
        this.check = true;

        this.webSocetServiceService.unsubscribeUser(this.selectChat.id,this.authUserId);
        this.webSocetServiceService.subscribeSession(this.selectChat.id, this.authUserId);

    });
  }

  ngOnDestroy() {
    this.webSocetServiceService.unsubscribeAll(this.selectChat.id);
    this.webSocetServiceService.sessionDataSubject.unsubscribe();
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

  playAudio(data: { track: string, messageId: number }) {
      const track = data.track;
      const messageId = data.messageId;
      this.musicService.playAudio(track, this.selectChat, this.authUserId, messageId);
      console.log("PlayAudio Chat");
  }

  pauseAudio(messageId:number) {
    this.musicService.pauseAudio(this.selectChat,messageId,this.authUserId);
    console.log("PauseAudio Chat");
  }

}

