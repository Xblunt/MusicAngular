import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { WebSocketConfig } from '../auth/config/WebSocetConfig';
import { Session } from '../model/session';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocetServiceService {
  sessionData: Session;
  private messageSubscription: Subscription;
  private sessionDataSubject: BehaviorSubject<Session> = new BehaviorSubject<Session>(new Session());
  private stompClient: RxStomp;
  sessionData$: Observable<Session> = this.sessionDataSubject.asObservable();
  constructor() {
    this.stompClient = new RxStomp();
  }


  updateSession(messageBody: any): void {
    this.stompClient.publish({ destination: `/sinx/${messageBody.chatId}`, body: JSON.stringify(messageBody) });
    console.log(JSON.stringify(messageBody));
  }

  getSessionData(chatId: number): void {
    const subscriptionUrl = `/chats/session/${chatId}`;
    debugger
    this.stompClient.watch(subscriptionUrl).subscribe((message) => {
      const data = JSON.parse(message.body);
      //debugger
      console.log(JSON.stringify(message.body));
      const sessionData: Session = {
        id: data.id,
        action: data.action,
        time: data.time,
        pause: data.pause,
        currentTimeOnDevice: data.currentTimeOnDevice
      };

      this.sessionDataSubject.next(sessionData);
    });
  }


  getStoredSessionData(): Observable<Session> {
    return this.sessionDataSubject.asObservable();
  }

  disconnectFromWebSocket() {
    this.stompClient.deactivate();
    setTimeout(() => {
        if (this.stompClient && this.stompClient.connected()) {
            console.error('Подключено к STOMP.');
        } else {
            console.error('Отключено от STOMP');
        }
    }, 1000);
}
  configure(webSocketConfig: any) {
    this.stompClient.configure(webSocketConfig);
  }
  activateWebSocket() {
    this.stompClient.activate();
  }


  connectToWebSocket() {
    // this.stompClient.configure(WebSocketConfig);
    // this.configure(WebSocketConfig);
    this.activateWebSocket();

    setTimeout(() => {
        if (this.stompClient && this.stompClient.connected()) {
            console.error('Подключено к STOMP.');
        } else {
            console.error('Подключение к STOMP отсутствует.');
        }
    }, 1000);
}
}



  // updateSession(messageBody: any): void {
  //   this.stompClient.publish({ destination: `/sinx/${messageBody.chatId}`, body: JSON.stringify(messageBody) });
  //   console.log(JSON.stringify(messageBody));

  //   this.getSessionData(messageBody.chatId).subscribe((sessionData: Session) => {
  //     console.log("message from server:", sessionData.action);
  //     console.log("message from server:", sessionData);
  //   },
  //   (error) => {
  //     console.error("Error:", error);
  //   });
  // }


  // getSessionData(chatId: number): Observable<Session> {
  //   const subscriptionUrl = `/chats/session/${chatId}`;

  //   if (this.messageSubscription) {
  //     this.messageSubscription.unsubscribe();
  //   }

  //   this.messageSubscription = this.stompClient.watch(subscriptionUrl).subscribe((message) => {
  //     const data = JSON.parse(message.body);
  //     const sessionData: Session = {
  //       id: data.id,
  //       action: data.action,
  //       time: data.time,
  //       pause: data.pause,
  //       currentTimeOnDevice: data.currentTimeOnDevice
  //     };

  //     this.sessionDataSubject.next(sessionData);
  //   });

  //   return this.sessionDataSubject.asObservable();
  // }
