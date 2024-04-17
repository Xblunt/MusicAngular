import { Message } from 'src/app/model/message';
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
  messageBody = {};

  constructor(private webSocetService: WebSocetServiceService) { }



    playAudio(trackUrl: string, chatId: Chat,authUserId: number, messageId: number ){
      this.currentTrack = trackUrl;
      console.log(this.currentTrack);
      this.song.src =  this.currentTrack;
      this.song.load();
      this.song.currentTime = 0;
      if(authUserId == messageId){
        const currentTimeOnDevice = Date.now();
        const action = true;
        const pause = false;
        this.transferToWS(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);
        console.log("Статус проигрывания обновлён");
        this.song.play();
      }
      else {
        this.webSocetService.sessionData$.subscribe((sessionData: Session) => {

          console.log("Received updated session data:", sessionData);
          this.song.currentTime = sessionData.time;
          if (sessionData.pause == true) {
              this.song.pause();
          } else {
              this.song.play();
          }
        });
    }
  }






  transferToWS(currentTime: number, action: boolean, chatId: number, pause: boolean, currentTimeOnDevice:number){
    this.messageBody = {
      time: currentTime,
      action: action,
      chatId: chatId,
      pause: pause,
      currentTimeOnDevice: currentTimeOnDevice
    };
    this.webSocetService.updateSession(this.messageBody);
  }

  pauseAudio( chatId: Chat,authUserId: number, messageId: number ){
    this.song.src =  this.currentTrack;
    if(authUserId == messageId){
        const currentTimeOnDevice = Date.now();
        const action = false;
        const pause = true;
        this.transferToWS(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);
        console.log("Статус остановки обновлён");
        this.song.pause();
    }
     else {
      this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
          const timeOnDeviceConnect = Date.now();

          if(sessionData.time == 0){
            this.song.currentTime = 0;
          }
          else{
            this.song.currentTime = sessionData.time + ((timeOnDeviceConnect - sessionData.currentTimeOnDevice));
          }

          this.song.pause();
          console.log("Трек остановлен");
      });
    }
  }


}


 // playAudio(trackUrl: string, chatId: Chat,authUserId: number, messageId: number ){
  //   this.currentTrack = trackUrl;
  //   console.log(this.currentTrack);
  //   this.song.src =  this.currentTrack;
  //   this.song.load();
  //   this.song.currentTime = 0;
  //   this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
  //     if(sessionData.action == true){
  //       const timeOnDeviceConnect = Date.now();
  //       //this.song.currentTime = sessionData.time + ((timeOnDeviceConnect - sessionData.currentTimeOnDevice));
  //       this.song.play();
  //       console.log("Трек запущен");
  //       console.log(sessionData.currentTimeOnDevice);
  //     }
  //     else if(sessionData.action == false){
  //       const timeOnDeviceConnect = Date.now();
  //       this.song.currentTime = sessionData.time + ((timeOnDeviceConnect - sessionData.currentTimeOnDevice));
  //       this.song.play();
  //       console.log("Трек остановлен");
  //       console.log(sessionData.currentTimeOnDevice);
  //     }
  //     else {
  //       const currentTimeOnDevice = Date.now();
  //       const action = true;
  //       const pause = false;
  //       this.transferToWS(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);
  //       console.log("Статус проигрывания обновлён");
  //       this.song.play();
  //     }
  //   });
  // }


  // playAudio(trackUrl: string, chatId: Chat,authUserId: number, messageId: number ){
  //   this.currentTrack = trackUrl;
  //   console.log(this.currentTrack);
  //   this.song.src =  this.currentTrack;
  //   this.song.load();
  //   this.song.currentTime = 0;
  //   if(authUserId == messageId){
  //       const currentTimeOnDevice = Date.now();
  //       const action = true;
  //       const pause = false;
  //       this.transferToWS(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);
  //       console.log("Статус проигрывания обновлён");
  //       this.song.play();
  //   }
    //  else{
    //   this.webSocetService.getSessionData(chatId.id).subscribe((sessionData: Session) => {
    //     console.log("pspspsp"+ sessionData.action);
    //     if(sessionData.action == true){
    //       const timeOnDeviceConnect = Date.now();
    //       if(sessionData.time == 0){
    //         this.song.currentTime = 0;
    //       }
    //       else{
    //         this.song.currentTime = sessionData.time + ((timeOnDeviceConnect - sessionData.currentTimeOnDevice));
    //         console.log("st"+sessionData.time );
    //         console.log("t"+timeOnDeviceConnect);
    //         console.log("sc" +  sessionData.currentTimeOnDevice);
    //       }
    //       this.song.play();
    //       console.log("Трек запущен");
    //       console.log(sessionData.currentTimeOnDevice);
    //     }
    //     else{
    //       console.log('Трэк не запущен:',sessionData.action);
    //     }
    //   });
    // }

  // }


  // pauseAudio(chatId: Chat, messageId: number,authUserId:number ){
  //   this.song.src =  this.currentTrack;
  //   const currentTimeOnDevice = Date.now();
  //   const action = false;
  //   const pause = true;
  //   this.transferToWS(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);
  //   this.song.pause();
  //   console.log("Пауза трека");
  // }

  // pauseAudio( chatId: Chat,authUserId: number, messageId: number ){
  //   this.song.src =  this.currentTrack;
  //   if(authUserId == messageId){
  //       const currentTimeOnDevice = Date.now();
  //       const action = false;
  //       const pause = true;
  //       this.transferToWS(this.song.currentTime, action, chatId.id,pause, currentTimeOnDevice);
  //       console.log("Статус остановки обновлён");
  //       this.song.pause();
  //   }
    //  else if (authUserId !== messageId) {
    //   this.webSocetService.getSessionData(chatId.id).subscribe((sessionData: Session) => {
    //     if(sessionData.action == false){
    //       const timeOnDeviceConnect = Date.now();
    //       if(sessionData.time == 0){
    //         this.song.currentTime = 0;
    //       }
    //       else{
    //         this.song.currentTime = sessionData.time + ((timeOnDeviceConnect - sessionData.currentTimeOnDevice));
    //         console.log("st"+sessionData.time );
    //         console.log("t"+timeOnDeviceConnect);
    //         console.log("sc" +  sessionData.currentTimeOnDevice);
    //       }
    //       this.song.pause();
    //       console.log("Трек остановлен");
    //       console.log(sessionData.currentTimeOnDevice);
    //     }
    //     else{
    //       console.log('Трэк не остановлен:',sessionData.action);
    //     }
    //   });
    // }
  // }
