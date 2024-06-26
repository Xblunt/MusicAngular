import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { MusicService } from 'src/app/service/music.service';
import { Component} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { ChatService } from 'src/app/service/chat.service';
import { Message } from 'src/app/model/message';
import { ClientService } from 'src/app/service/client.service';
import { Page } from 'src/app/model/page';
import { PlaylistComponent } from 'src/app/components/dialog/playlist/playlist/playlist.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { ActionStatus, Session } from 'src/app/model/session';
import { NGXLogger } from "ngx-logger";


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
  trackUrlToMessage: string;



  constructor(private chatService: ChatService, private clientService: ClientService, public dialog:MatDialog,
    private authService: AuthService, private musicService: MusicService, private webSocetServiceService:WebSocetServiceService, private logger: NGXLogger
  ) {
   this.message = new Message;
   this.authUserId = this.authService.getAuthUserId();
   this.logger.log(`userId: ${this.authUserId}`);
  }

  ngOnInit(){
    this.chatService.eventEmitter.subscribe(chat=>{
      this.selectChat = chat;
      this.loadMessages(this.selectChat);
      this.logger.log("SelectChat: ", this.selectChat.id);
      this.logger.error("SelectChat: ", this.selectChat.id);
      this.webSocetServiceService.subscribeSession(this.selectChat.id, this.authUserId);
      this.getSessionMap(this.selectChat.id);
    });
  }

  ngOnDestroy() {
    this.webSocetServiceService.unsubscribeUser(this.selectChat.id,this.authUserId);
  }

  getSessionMap(selectChat:number) {
    this.clientService.getSessionMap(selectChat).subscribe((data: Session) => {
      this.logger.log('Map session data:', data);
      this.actionTrackLogin(data);
    });
  }

  loadMessages(chat: Chat): void {
    this.chatService.getAllMessages(chat.id,this.pageSize).subscribe((response: Page<Message>) => {
      this.messageArray = response.content;
      this.logger.log('Received messages:', this.messageArray);
    });
  }

  createMessages(chat:Chat):void{
    this.chatService.createMessage(this.message, this.selectChat.id, this.authUserId,  this.messageText).subscribe(k => {
      this.logger.log('this chat:',this.selectChat);
      this.loadMessages(chat);
    });
    this.messageText = '';
  }

  openPlaylist(): void {
    const dialogRef = this.dialog.open(PlaylistComponent, {
      data: this.selectChat.id
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.logger.log('Changes saved:', result);
      }
      else {
        this.logger.log('The window is closed without saving changes.');
        this.logger.warn('The window is closed without saving changes.');
        this.logger.error('The window is closed without saving changes.');
      }
    });
  }

  actionTrackLogin(session:Session){
    this.musicService.definitionAction(this.selectChat.id,this.authUserId);
    if(session.action == ActionStatus.Play){
      this.musicService.playAudio(this.selectChat.id, session,this.authUserId);
    }
    else if(session.action == ActionStatus.Pause){
      this.musicService.pauseAudio(this.selectChat.id, session,this.authUserId);
    }
    else{
      this.logger.error("MapSessionData null")
    }
    this.trackUrlToMessage = session.trackUrl;
  }

  onMediaEvent(event: { action: string, track: string }) {
    if(event.action == 'Play'){
    this.musicService.updateChatSession(this.selectChat.id, ActionStatus.Play, event.track, this.authUserId);
    this.logger.log("PlayAudio Chat");
    }
    else {
    this.musicService.updateChatSession(this.selectChat.id, ActionStatus.Pause, event.track,  this.authUserId);
    this.logger.log("PauseAudio Chat");
    }

  }

  seekTrack(event:{time: number, track: string}){
    this.musicService.seekAudio(event.time,event.track,this.authUserId,this.selectChat.id)
  }

  setVolumeTrack(volumeValue:number){
    this.musicService.setVolume(volumeValue);
  }

}

