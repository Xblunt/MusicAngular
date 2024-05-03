import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Injectable } from '@angular/core';
import { Chat } from '../model/chat';
import { ActionStatus, Session } from '../model/session';
import { ClientService } from './client.service';
import { take, delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MusicService {
  song = new Audio;
  currentTrack: string;
  action: ActionStatus;


  constructor(private webSocetService: WebSocetServiceService,private clientService: ClientService) { }

  subscriptionVerification(selectChatId: number,authUserId: number){
    const hasSubscription = this.webSocetService.hasSubscriptionForUser(authUserId);

    if (hasSubscription) {
      console.log(`Подписка для пользователя ${authUserId} существует.`);
      this.webSocetService.sessionDataSubject.pipe(delay(100),take(10)).subscribe((sessionData: Session) => {
        this.definitionAction(selectChatId,authUserId, sessionData);
      });
    }
    else {
      console.log(`Подписки для пользователя ${authUserId} не существует.`);
      this.webSocetService.subscribeSession(selectChatId, authUserId);
      this.webSocetService.sessionDataSubject.pipe(delay(100),take(10)).subscribe((sessionData: Session) => {
        this.definitionAction(selectChatId,authUserId, sessionData);
      });
    }
  }

  definitionAction(selectChatId:number, authUserId: number,sessionData:Session){
    // this.currentTrack = trackUrl;

    console.log('Полученные данные о сессии:', sessionData);
    if(sessionData.action === ActionStatus.Play){
      this.playAudio(selectChatId, sessionData.trackTime, authUserId, sessionData.actionTime, sessionData.playerId, sessionData.id, sessionData.trackUrl);
      console.log('Запуск трека...');
    }
    else if(sessionData.action === ActionStatus.Pause){
      this.pauseAudio(selectChatId, sessionData.trackTime, authUserId,sessionData.actionTime, sessionData.playerId, sessionData.id, sessionData.trackUrl);
      console.log('Трек поставлен на паузу.');
    }
  }

  transferToWS( selectChatId:number, command: string, trackUrl:string,  authUserId: number){
    const currentTimeOnDevice = Date.now();
    if(command === ActionStatus.Play) {
      this.action = ActionStatus.Play;
    }
    else {
      this.action = ActionStatus.Pause;
    }
    const messageBody: Session  = {
      trackTime: this.song.currentTime,
      action: this.action,
      id: selectChatId,
      actionTime: currentTimeOnDevice,
      playerId: authUserId,
      trackUrl: trackUrl,
    };


    this.clientService.updateSession(messageBody).subscribe((updatedSession: Session) => {
      console.log('Обновленная сессия:', updatedSession);
      this.webSocetService.sendGetSession(updatedSession.id);

      setTimeout(() => {
        this.subscriptionVerification(selectChatId, authUserId);
      }, 500);
    });
  }

  playAudio(selectChatId:number, songTime:number, authUserId:number, sessionTimeOnDevice: number,   playerId: number, sessionId:number, trackUrl: string){
    console.log('playAudio');
    if(selectChatId === sessionId){
      this.song.src = trackUrl;
      if(authUserId === playerId){
        this.song.currentTime = songTime;
        this.song.play();
      }
      else {
        const currentTimeOnDevicePlay = Date.now();
        this.song.currentTime = songTime + ((currentTimeOnDevicePlay - sessionTimeOnDevice)/1000);
        this.song.play();
      }
    }

  }

  pauseAudio(selectChatId:number, songTime:number,authUserId:number, sessionTimeOnDevice: number, playerId: number, sessionId:number, trackUrl: string){
    console.log('pauseAudio');
    if(selectChatId === sessionId){
      this.song.src = trackUrl;
      if(authUserId === playerId){
        this.song.currentTime = songTime;
        this.song.pause();
      }
      else {
        const currentTimeOnDevicePause = Date.now();
        this.song.currentTime = songTime  + ((currentTimeOnDevicePause - sessionTimeOnDevice)/1000);
        this.song.pause();
      }
   }
  }

}
