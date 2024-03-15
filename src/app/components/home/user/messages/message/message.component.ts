import { Component, Input} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Message } from 'src/app/model/message';
import { MusicService } from 'src/app/service/music.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  @Input() selectChat!: Chat;
  @Input() message!: Message;

  constructor(private musicService: MusicService){
  }


  playAudio(event: Event) {
    this.musicService.playAudio(this.message.track.file, event);
  }

  pauseAudio(event: Event) {
    this.musicService.pauseAudio(event);
  }



}
