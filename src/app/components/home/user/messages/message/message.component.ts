import { Component, Input} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Track } from 'src/app/model/track';
import { Message } from 'src/app/model/message';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {


  @Input() track!: Track;
  @Input() selectChat!: Chat;
  @Input() message!: Message;

  constructor(){
  }




}
