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
  @Output() playEvent = new EventEmitter<any>();
  @Output() pauseEvent = new EventEmitter<any>();
  constructor(private webSocetService: WebSocetServiceService){
  }

  playMessageAudio(track: string, messageId: number) {
    this.playEvent.emit(track);
  }

  pauseMessageAudio(track: string, messageId: number) {
    this.pauseEvent.emit(track);
  }

}
