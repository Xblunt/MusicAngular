import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Message } from 'src/app/model/message';
import { Session } from 'src/app/model/session';
import { Track } from 'src/app/model/track';
import { WebSocetServiceService } from 'src/app/service/web-socet-service.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages:  Message[]=[];
  message: Message;
  tracks: Track[]=[];
  TimeOnDeviceConnect!: number;
  secondid!:number;
  firstid!:number;

  @Input() chat!: Chat;
  @Input() mess: any[]=[];
  @Input() track!: Track;

  constructor(private webSocetService: WebSocetServiceService) {
    this.message = new Message;
  }

  @ViewChild('myAudioElement') audioElement!: ElementRef<HTMLAudioElement>;

  playAudio() {
    const chatId = this.chat.id;
    const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
    console.log("PLAAAAY");
    console.log("Current time plaaaayy:", audioElement.currentTime);

    const currentTime = audioElement.currentTime * 1000;
    const action = true;
    const pause = false;
    const currentTimeOnDevice = Date.now();
    console.log("Время пользователя при запуске трека",currentTimeOnDevice);

    this.webSocetService.updateSession(currentTime, action, chatId,pause, currentTimeOnDevice);

    this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
      audioElement.currentTime = sessionData.time/1000;
      audioElement.play();
  });
  }


  pauseAudio() {
    const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
    const chatId = this.chat.id;
    audioElement.pause();

    const pause = true;
    const currentTime = audioElement.currentTime * 1000;
    const action = false;
    const currentTimeOnDevice = Date.now();
    console.log("Время пользователя при остановке трека",currentTimeOnDevice);

    this.webSocetService.updateSession(currentTime, action, chatId,pause, currentTimeOnDevice);
    console.log("STOOOOP");
    console.log("Current time stooop:", audioElement.currentTime);
    this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
      audioElement.currentTime = sessionData.time/1000;
      audioElement.pause();
  });
  }


  update(): void {
    // this.webSocetServiceService.activate();
    // this.webSocetServiceService.connectToWebSocket();
    // this.connected = true;
    console.log("update" );
    const chatId = this.chat.id;
    console.log("update chatId", chatId);
    const audioElement = this.audioElement.nativeElement as HTMLAudioElement;
    this.webSocetService.getStoredSessionData().subscribe((sessionData: Session) => {
      console.log("data from server:", sessionData);
      console.log("data from server:", sessionData.action);
      if( sessionData.action === true){
        this.TimeOnDeviceConnect = Date.now();
        audioElement.currentTime = sessionData.time + ((this.TimeOnDeviceConnect/1000 - sessionData.currentTimeOnDevice/1000));
        audioElement.play();
        }
        else if (sessionData.action === false){
          const timepause = sessionData.time / 1000;
          audioElement.currentTime = timepause;
          console.log("ata.time stop",audioElement.currentTime );
          audioElement.pause();
          }
        else {
          console.log("Need play and stop")
        }
    });
  }

}
