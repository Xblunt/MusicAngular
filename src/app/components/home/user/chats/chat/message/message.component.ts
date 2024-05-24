import { MusicService } from 'src/app/service/music.service';
import { ClientService } from './../../../../../../service/client.service';
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Message } from 'src/app/model/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  duration: number;
  time: number;
  trackTimeSubscription: Subscription;
  playinTrackUrl: string;
  @Input() selectChat: Chat;
  @Input() message: Message;
  @Input() authUserId: number;
  @Input() trackUrlToMessage: string;
  isPlaying: boolean = false;

  @Output() playEvent = new EventEmitter<any>();
  @Output() pauseEvent = new EventEmitter<any>();
  constructor(private musicService: MusicService){

  }

  ngOnInit(){
    this.musicService.trackDuration$.subscribe((trackDuration) => {
      console.log('Длительность трека из сервиса:', trackDuration);
      this.duration = trackDuration;
    });
    this.trackTimeSubscription = this.musicService.trackTimeSubject.subscribe(trackTime => {
      this.time = trackTime;
    });
    // this.musicService.currentTrackUrl$.subscribe((trackurl) => {
    //   console.log('now trackUrk:', trackurl);
    //   this.playinTrackUrl = trackurl;
    // });
  }

  ngOnDestroy(){
    this.trackTimeSubscription.unsubscribe();
  }

  playMessageAudio(track: string) {
    this.playEvent.emit(track);
    //this.isPlaying = true;
  }

  pauseMessageAudio(track: string) {
    this.pauseEvent.emit(track);
    //this.isPlaying = false;
  }

  setVolume(event: any){
    const volumeValue = event.target.value;
    this.musicService.setVolume(volumeValue);
  }

  seekAudio(event:any, track:string){
    const time = event.target.value;
    this.musicService.seekAudio(time,track,this.authUserId,this.selectChat.id)
  }

}
