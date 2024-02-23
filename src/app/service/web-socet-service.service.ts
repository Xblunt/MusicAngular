import { Message } from 'src/app/model/message';
import { HomeService } from 'src/app/service/home.service';
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { WebSocketConfig } from '../auth/config/WebSocetConfig';
import { Session } from '../model/session';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable,Subject  } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export  class WebSocetServiceService extends RxStomp {
  private dataSubject = new Subject<any>();
  sessionData!: Session;
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
  // getSessionData(chatId: number): Observable<Session> {
  //   const subscriptionUrl = `/chats/session/${chatId}`;

  //   return new Observable<Session>(observer => {
  //     this.stompClient.subscribe(subscriptionUrl, (message) => {
  //       const data = JSON.parse(message.body);
  //       const sessionData = new Session();
  //       sessionData.id = data.id;
  //       sessionData.action = data.action;
  //       sessionData.time = data.time;
  //       sessionData.pause = data.pause;
  //       sessionData.currentTimeOnDevice = data.currentTimeOnDevice;

  //       this.sessionDataSubject.next(sessionData);
  //       observer.next(sessionData);
  //     });
  //   });
  // }





  // getData(){
  //   debugger
  //   return this.dataSubject.asObservable();
  // }



  // getSessionData(chatId: number){
  //   // return this.sessionData;
  //   // return this.sessionDataSubject.asObservable();
  //   const subscriptionUrl = `/chats/session/${chatId}`;
  //   console.log(subscriptionUrl);
  //   this.stompClient.subscribe(subscriptionUrl, (message) => {
  //    const data = JSON.parse(message.body);
  //    this.sessionData = new Session();

  //    this.sessionData .id = data.id;
  //    this.sessionData .action = data.action;
  //    this.sessionData .time = data.time;
  //    this.sessionData .pause = data.pause;
  //    this.sessionData .currentTimeOnDevice = data.currentTimeOnDevice;
  //    this.sessionDataSubject.next(this.sessionData);
  //    // this.dataSubject.next(data);
  //    console.log("Received message from server:",  this.sessionData);
  //   //  console.log("Received message from server:", this.sessionData );
  //    return  this.sessionData;
  //   });
  // }

