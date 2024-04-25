import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Injectable } from '@angular/core';
import { Chat } from '../model/chat';
import { Session } from '../model/session';
import { ClientService } from './client.service';
import { take, delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MusicService {
  song = new Audio;
  currentTrack: string;
  pause: boolean;
  action: boolean;

  constructor(private webSocetService: WebSocetServiceService,private clientService: ClientService) { }

  subscriptionVerification(trackUrl: string, chat: Chat, authUserId: number, messageUserId:number){
    const hasSubscription = this.webSocetService.hasSubscriptionForUser(authUserId);

    if (hasSubscription) {
      console.log(`Подписка для пользователя ${authUserId} существует.`);
      this.webSocetService.sessionDataSubject.pipe(delay(100),take(10)).subscribe((sessionData: Session) => {
        this.definitionAction(trackUrl,authUserId, sessionData,messageUserId);
      });
    }
    else {
      console.log(`Подписки для пользователя ${authUserId} не существует.`);
      this.webSocetService.subscribeSession(chat.id, authUserId);
      this.webSocetService.sessionDataSubject.pipe(delay(100),take(10)).subscribe((sessionData: Session) => {
        this.definitionAction(trackUrl,authUserId, sessionData, messageUserId);
      });
    }
  }

  definitionAction(trackUrl: string, authUserId: number,sessionData:Session, messageUserId:number){
    this.currentTrack = trackUrl;

    console.log('Полученные данные о сессии:', sessionData);

    if(sessionData.action === true){
      this.playAudio(sessionData.time, authUserId, sessionData.currentTimeOnDevice, messageUserId);
      console.log('Запуск трека...');
    }
    else if(sessionData.action === false){
      this.pauseAudio(sessionData.time, authUserId,sessionData.currentTimeOnDevice, messageUserId);
      console.log('Трек поставлен на паузу.');
    }
  }

  transferToWS( id: number, command: string, trackUrl:string, chat: Chat,  authUserId: number, messageUserId:number){
    const currentTimeOnDevice = Date.now();
    if(command === "Play") {
      this.action = true;
      this.pause = false;
    }
    else {
      this.action = false;
      this.pause= true;
    }
    const messageBody: Session  = {
      time: this.song.currentTime,
      action: this.action,
      id: id,
      pause: this.pause,
      currentTimeOnDevice: currentTimeOnDevice
    };
    this.clientService.updateSession(messageBody).subscribe((updatedSession: Session) => {
      console.log('Обновленная сессия:', updatedSession);
      this.webSocetService.sendGetSession(updatedSession.id);
      setTimeout(() => {
        this.subscriptionVerification(trackUrl, chat, authUserId, messageUserId);
      }, 500);
    });
  }

  playAudio(songTime:number, authUserId:number, sessionTimeOnDevice: number,  messageUserId: number){
    console.log('playAudio');
    this.song.src = this.currentTrack;
    if(authUserId === messageUserId){
      this.song.currentTime = songTime;
      this.song.play();
    }
    else {
      const currentTimeOnDevicePlay = Date.now();
      this.song.currentTime = songTime + ((currentTimeOnDevicePlay - sessionTimeOnDevice)/1000);
      console.log('playAudio songTime', songTime);
      console.log('playAudio currentTimeOnDevicePlay', currentTimeOnDevicePlay);
      console.log('playAudio sessionTimeOnDevice', sessionTimeOnDevice);
      this.song.play();
    }
  }

  pauseAudio( songTime:number,authUserId:number, sessionTimeOnDevice: number, messageUserId: number){
    console.log('pauseAudio');
    this.song.src = this.currentTrack;
    if(authUserId === messageUserId){
      this.song.currentTime = songTime;
      this.song.pause();
    }
    else {
      const currentTimeOnDevicePause = Date.now();
      this.song.currentTime = songTime  + ((currentTimeOnDevicePause - sessionTimeOnDevice)/1000);
      console.log('pauseAudio songTime', songTime*1000);
      console.log('pauseAudio currentTimeOnDevicePause', currentTimeOnDevicePause);
      console.log('pauseAudio sessionTimeOnDevice', sessionTimeOnDevice);
      this.song.pause();
    }
  }

}
