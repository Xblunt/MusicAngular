import { Message } from 'src/app/model/message';
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Injectable } from '@angular/core';
import { Chat } from '../model/chat';
import { Session } from '../model/session';
import { ClientService } from './client.service';


@Injectable({
  providedIn: 'root'
})
export class MusicService {
  song = new Audio;
  currentTrack: string;
  messageBody = {};

  constructor(private webSocetService: WebSocetServiceService,private clientService: ClientService) { }



  playAudio(trackUrl: string, chatId: Chat,authUserId: number, messageId: number ){

    this.webSocetService.sessionDataSubject.subscribe((sessionData: Session) => {
      this.currentTrack = trackUrl;
      const currentTimeOnDevice = Date.now();
      this.song.src = this.currentTrack;
      this.song.currentTime = 0;
      console.log('Полученные данные о сеансе:', sessionData);
      if(sessionData.action === true){
        this.song.currentTime = sessionData.time + ((currentTimeOnDevice - sessionData.currentTimeOnDevice));
        this.song.play();
      }
      else {
        const action = true;
        const pause = false;
        this.transferToWS(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);

        if(sessionData.time === 0 && sessionData.time === null){
          this.song.currentTime = sessionData.time;
        }
        else{
          this.song.currentTime = sessionData.time + ((currentTimeOnDevice - sessionData.currentTimeOnDevice));
        }
        this.song.play();
      }
    });
  }

  transferToWS(currentTime: number, action: boolean, id: number, pause: boolean, currentTimeOnDevice:number){
    const messageBody: Session  = {
      time: currentTime,
      action: action,
      id: id,
      pause: pause,
      currentTimeOnDevice: currentTimeOnDevice
    };
    this.clientService.updateSession(messageBody).subscribe((updatedSession: Session) => {
      console.log('Обновленная сессия:', updatedSession);
      this.webSocetService.sendGetSession(updatedSession.id);
    });
  }

  pauseAudio(chatId: Chat,authUserId: number, messageId: number ){

    this.webSocetService.sessionDataSubject.subscribe((sessionData: Session) => {
      const currentTimeOnDevice = Date.now();
      this.song.src = this.currentTrack;
      console.log('Полученные данные о сеансе:', sessionData);
      if(sessionData.action === false){
        this.song.currentTime = sessionData.time + ((currentTimeOnDevice - sessionData.currentTimeOnDevice));
        this.song.pause();
      }
      else {
        const action = false;
        const pause = true;
        this.transferToWS(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);

        if(sessionData.time === 0 && sessionData.time === null){
          this.song.currentTime = 0;
        }
        else{
          this.song.currentTime = sessionData.time + ((currentTimeOnDevice - sessionData.currentTimeOnDevice));
        }
        this.song.pause();
      }
    });
  }

}
