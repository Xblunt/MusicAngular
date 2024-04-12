import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Message } from 'src/app/model/message';
import { Track } from 'src/app/model/track';
import { MusicService } from 'src/app/service/music.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  currenTime: number = 0;
  connected: boolean = false;
  @Input() selectChat: Chat;
  @Input() message: Message;
  @Input() authUserId: number;
  @Output() playEvent = new EventEmitter<any>();
  @Output() pauseEvent = new EventEmitter<any>();

  constructor(private webSocetService: WebSocetServiceService){
  }

  playMessageAudio(track: string) {
    this.playEvent.emit(track);
    this.webSocetService.connectToWebSocket();
    this.connected = true;
    console.log("WS connected");
  }

  diconnectedWebSocket(){
    this.webSocetService.disconnectFromWebSocket();
    this.connected = false
    console.log("WS disconnected");
  }

  pauseMessageAudio(track: string) {
    this.pauseEvent.emit(track);
  }

  // getCurrentTime(track: string) {
  //   return this.musicService.getTrackTime(track, this.selectChat);
  // }

}
