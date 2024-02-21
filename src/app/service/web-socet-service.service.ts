import { HomeService } from 'src/app/service/home.service';
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { WebSocketConfig } from '../auth/config/WebSocetConfig';
import { Session } from '../model/session';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject  } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebSocetServiceService extends RxStomp {
  private dataSubject = new Subject<any>();

  constructor(){
    super();
  }

  updateSession(currentTime: number, action: string, chatId: number, pause: boolean): void {
    const message = {
      time: currentTime,
      action: action,
      chatId: chatId,
      pause: pause
    };
    this.publish({ destination: '/sinx', body: JSON.stringify(message) });
    console.log(JSON.stringify(message));

    this.connectToWebSocket();

    this.stompClient.subscribe('/chats/session', (message) => {
      const data = JSON.parse(message.body);
      this.dataSubject.next(data);
      // console.log("Received message from server:", data);

    });
  }


  connectToWebSocket() {
    this.configure(WebSocketConfig);
    this.activate();
  }


  getData() {
    return this.dataSubject.asObservable();
  }


  disconnectFromWebSocket() {
    this.deactivate();
  }
}
