
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Injectable } from '@angular/core';
import { ActionStatus, Session } from '../model/session';
import { ClientService } from './client.service';
import { take, delay } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MusicService {
  song = new Audio;
  action: ActionStatus;
  сurrentTrack: string;
  trackDuration: number;
  private trackDurationSubject = new BehaviorSubject<number>(0);
  trackDuration$ = this.trackDurationSubject.asObservable();
  trackTimeSubject: Subject<number> = new Subject<number>();

  //currentTrackUrl: Subject<string> = new Subject<string>();
  private currentTrackUrlSubject = new BehaviorSubject<string>("");
  currentTrackUrl$ = this.currentTrackUrlSubject.asObservable();

  constructor(private webSocetService: WebSocetServiceService,private clientService: ClientService) { }

  definitionAction(selectChatId:number, authUserId: number){
    this.webSocetService.sessionDataSubject.pipe(delay(100),take(10)).subscribe((sessionData: Session) => {
      console.log('Полученные данные о сессии:', sessionData);

      if(sessionData.action === ActionStatus.Play){
        this.playAudio(selectChatId, sessionData, authUserId);
        console.log('Запуск трека...');
      }
      else if(sessionData.action === ActionStatus.Pause){
        this.pauseAudio(selectChatId, sessionData, authUserId);
        console.log('Трек поставлен на паузу.');
      }
    });
  }

  updateChatSession(selectChatId:number, command: ActionStatus, trackUrl:string,  authUserId: number){

    const actionTime = Date.now();
    if(command == ActionStatus.Play) {
      this.action = command;
    }
    else {
      this.action = ActionStatus.Pause;
    }

    if(trackUrl !== this.сurrentTrack){
      this.song.currentTime = 0;
    }

    const messageBody: Session  = {
      trackTime: this.song.currentTime,
      action: this.action,
      id: selectChatId,
      actionTime: actionTime,
      playerId: authUserId,
      trackUrl: trackUrl,
    };

    this.clientService.updateSession(messageBody).subscribe((updatedSession: Session) => {
      this.webSocetService.sendGetSession(selectChatId);
      console.log('Обновленная сессия:', updatedSession);

      setTimeout(() => {
        this.definitionAction(selectChatId, authUserId);
      }, 100);
    });
  }

  playAudio(selectChatId:number, session:Session, authUserId:number){
    console.log('playAudio');

    if(selectChatId == session.id){
      this.сurrentTrack = session.trackUrl;
      this.song.src = session.trackUrl;
      this.currentTrackUrlSubject.next(session.trackUrl);

      this.song.addEventListener('loadedmetadata', () => {
        //console.log('Длительность трека:', this.song.duration);
        //this.trackDuration = Math.floor(this.song.duration);
        this.trackDuration = this.song.duration;
        this.trackDurationSubject.next(this.trackDuration);
      });

      if(session.trackTime == this.trackDuration){
        session.trackTime = 0;
      }


      if(authUserId === session.playerId){
        this.song.currentTime = session.trackTime;
      }
      else {
        const actionTimePlay = Date.now();
        this.song.currentTime = session.trackTime + ((actionTimePlay - session.actionTime)/1000);
      }

      this.song.addEventListener('timeupdate', () => {
        this.trackTimeSubject.next(this.song.currentTime);
      });
      this.song.play();
    }
  }

  pauseAudio(selectChatId:number, session:Session, authUserId:number){
    console.log('pauseAudio');
    if(selectChatId == session.id){
      this.сurrentTrack = session.trackUrl;
      this.song.src = session.trackUrl;
      if(authUserId == session.playerId){
        this.song.currentTime = session.trackTime;
        this.trackTimeSubject.next(this.song.currentTime);
      }
      else {
        const actionTimePause = Date.now();
        this.song.currentTime = session.trackTime  + ((actionTimePause - session.actionTime)/1000);
      }
      this.song.pause();
   }
  }

  setVolume(volumeValue: number){
    this.song.volume = volumeValue;
  }

  seekAudio(seekTime:number, track: string, authUserId: number, selectChat: number){
    this.song.currentTime = seekTime;
    this.updateChatSession(selectChat, ActionStatus.Play,track,authUserId);
  }



}
