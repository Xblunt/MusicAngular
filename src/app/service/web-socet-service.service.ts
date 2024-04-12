import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { WebSocketConfig } from '../auth/config/WebSocetConfig';
import { Session } from '../model/session';
import { BehaviorSubject, Observable,Subject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export  class WebSocetServiceService extends RxStomp {
  sessionData: Session;
  private sessionDataSubject: BehaviorSubject<Session> = new BehaviorSubject<Session>(new Session());

  message = {};
  constructor(){
    super();
  }


  updateSession(currentTime: number, action: boolean, chatId: number, pause: boolean, currentTimeOnDevice:number): void {
    this.message = {
      time: currentTime,
      action: action,
      chatId: chatId,
      pause: pause,
      currentTimeOnDevice: currentTimeOnDevice
    };
    this.publish({ destination: `/sinx/${chatId}`, body: JSON.stringify(this.message) });
    // this.publish({ destination: `/sinx`, body: JSON.stringify(message) });
    console.log(JSON.stringify(this.message));

    //  this.connectToWebSocket();
    this.getSessionData(chatId).subscribe((sessionData: Session) => {
      console.log("message from server:", sessionData.action);
      console.log("message from server:", sessionData);
    },
      (error) => {
          console.error("Error:", error);
      }
    );

  }

  getSessionData(chatId: number): Observable<Session> {
    const subscriptionUrl = `/chats/session/${chatId}`;

    return new Observable<Session>(observer => {
      if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(subscriptionUrl, (message) => {
          const data = JSON.parse(message.body);
          const sessionData: Session = {
            id: data.id,
            action: data.action,
            time: data.time,
            pause: data.pause,
            currentTimeOnDevice: data.currentTimeOnDevice
          };

          this.sessionDataSubject.next(sessionData);
          observer.next(sessionData);
      });
      }
      else {
        console.error('Подключение к STOMP отсутствует.');
      }
    });

  }


  getStoredSessionData(): Observable<Session> {
    return this.sessionDataSubject.asObservable();
  }


  disconnectFromWebSocket() {
    this.deactivate();
  }


  connectToWebSocket() {

    this.configure(WebSocketConfig);
    this.activate();
  }

}
