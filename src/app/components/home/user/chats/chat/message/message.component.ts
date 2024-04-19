import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Message } from 'src/app/model/message';

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
  // @Output() playEvent = new EventEmitter<any>();
  // @Output() pauseEvent = new EventEmitter<any>();
  @Output() playEvent: EventEmitter<{ track: string, messageId: number }> = new EventEmitter();
  @Output() pauseEvent: EventEmitter<{ track: string, messageId: number }> = new EventEmitter();
  constructor(private webSocetService: WebSocetServiceService){
  }

  // diconnectedWebSocket(){
  //   this.webSocetService.disconnectFromWebSocket();
  //   this.connected = false
  //   console.log("WS disconnected");
  // }

  // connectToWebSocket(){
  //   this.webSocetService.connectToWebSocket();
  //   this.connected = true;
  //   console.log("WS connected");
  // }
  playMessageAudio(track: string, messageId: number) {
    const eventData = { track: track, messageId: messageId };
    this.playEvent.emit(eventData);
  }

  pauseMessageAudio(track: string, messageId: number) {
    const eventData = { track: track, messageId: messageId };
    this.pauseEvent.emit(eventData);
  }

  // getCurrentTime(track: string) {
  //   return this.musicService.getTrackTime(track, this.selectChat);
  // }

}
