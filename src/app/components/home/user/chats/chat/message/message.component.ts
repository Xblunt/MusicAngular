import { MusicService } from 'src/app/service/music.service';
import { Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() message: Message;
  @Input() authUserId: number;
  @Input() trackUrlToMessage: string;
  @Output() mediaEvent = new EventEmitter<{ action: string, track: string }>();
  @Output() setVolumeEvent = new EventEmitter<any>();
  @Output() seekAudioEvent = new EventEmitter<{ time: number, track: string }>();
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
  }

  ngOnDestroy(){
    this.trackTimeSubscription.unsubscribe();
  }

  actionTrack(action: string, track: string){
    this.mediaEvent.emit({ action: action, track: track });
  }

  setVolume(event: any){
    const volumeValue = event.target.value;
    this.setVolumeEvent.emit(volumeValue);
  }

  seekAudio(event:any, track:string){
    const time = event.target.value;
    this.seekAudioEvent.emit({time,track});
  }

}
