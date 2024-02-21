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

  //   this.watch("client/chats/session").subscribe(() => {
  //     this.homeService.getSession(chatId)
  //         .subscribe((data) => console.log("Now session is " + data.action));
  // });
  }
  // updateSession(currentTime: number, action: string, chatId: number): Observable<Session> {
  //   const message = {
  //     time: currentTime,
  //     action: action,
  //     chatId: chatId
  //   };

  //   this.publish({ destination: '/sinx', body: JSON.stringify(message) });
  //   console.log(JSON.stringify(message));

  //   const subject = new Subject<Session>();

  //   this.watch("client/tracks/send/session").subscribe(() => {
  //     this.homeService.getSession(chatId)
  //       .subscribe((data) => {
  //         console.log("Now session is " + data.action);
  //         subject.next(data);
  //       });
  //   });

  //   return subject.asObservable();
  // }

  connectToWebSocket() {
    this.configure(WebSocketConfig);
    this.activate();


  }
  private dataSubject = new Subject<any>();

  // updateData(data: any) {

  // }

  getData() {
    return this.dataSubject.asObservable();

  }
  disconnectFromWebSocket() {
    this.deactivate();
  }
}
