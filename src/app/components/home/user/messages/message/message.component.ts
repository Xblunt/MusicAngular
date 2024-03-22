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
  @Input() selectChat!: Chat;
  @Input() message!: Message;
  @Output() playEvent = new EventEmitter<Track>();
  @Output() pauseEvent = new EventEmitter<any>();

  constructor(private musicService: MusicService){
  }

  @ViewChild('myAudioElement') audioPlayer!: ElementRef;

  playMessageAudio(track: Track) {
    this.playEvent.emit(track);
  }

  pauseMessageAudio(track: Track) {
    this.pauseEvent.emit(track);
  }

  getCurrentTime(track: Track) {
    return this.musicService.getTrackTime(track.id, this.selectChat);
  }

}
