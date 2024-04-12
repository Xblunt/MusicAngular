import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
import { Injectable } from '@angular/core';
import { Chat } from '../model/chat';
import { Session } from '../model/session';


@Injectable({
  providedIn: 'root'
})
export class MusicService {
  song = new Audio;
  currentTrack: string;

  constructor(private webSocetService: WebSocetServiceService) { }

  setCurrentTrack(trackUrl:string){
    this.currentTrack = trackUrl;
    console.log(this.currentTrack);
  }

  playAudio(trackUrl: string, chatId: Chat){
    this.song.src =  this.currentTrack;
    this.song.load();
    this.song.currentTime = 0;
    this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
      if(sessionData.action == true){
        const timeOnDeviceConnect = Date.now();
        //this.song.currentTime = sessionData.time + ((timeOnDeviceConnect - sessionData.currentTimeOnDevice));
        this.song.play();
        console.log("Трек запущен");
        console.log(sessionData.currentTimeOnDevice);
      }
      else if(sessionData.action == false){
        const timeOnDeviceConnect = Date.now();
        this.song.currentTime = sessionData.time + ((timeOnDeviceConnect - sessionData.currentTimeOnDevice));
        this.song.play();
        console.log("Трек остановлен");
        console.log(sessionData.currentTimeOnDevice);
      }
      else {
        const currentTimeOnDevice = Date.now();
        const action = true;
        const pause = false;
        this.webSocetService.updateSession(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);
        console.log("Статус проигрывания обновлён");
        this.song.play();
      }
    });
  }



  pauseAudio(trackUrl: string, chatId: Chat){
    this.song.src =  this.currentTrack;
    const currentTimeOnDevice = Date.now();
    const action = false;
    const pause = true;
    this.webSocetService.updateSession(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);
    this.song.pause();
    console.log("Пауза трека");
  }


}
