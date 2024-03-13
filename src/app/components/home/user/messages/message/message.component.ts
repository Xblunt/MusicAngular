import { Component, Input} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Track } from 'src/app/model/track';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  @Input() messageArray: any[]=[];
  @Input() track!: Track;
  @Input() selectChat!: Chat;

  constructor(){
  }




}
