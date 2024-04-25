import { SubscriptionUser } from './../model/subscriptionUser';
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { Session } from '../model/session';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocetServiceService {
  sessionData: Session;
  private subscription: Subscription;
  private subscriptionList: any[] = [];
  private activeSubscriptions: SubscriptionUser[] = [];
  public sessionDataSubject: BehaviorSubject<Session> = new BehaviorSubject<Session>(new Session());
  private stompClient: RxStomp;
  sessionData$: Observable<Session> = this.sessionDataSubject.asObservable();
  constructor() {
    this.stompClient = new RxStomp();
  }


  sendGetSession(messageBody: number): void {
    this.stompClient.publish({ destination: `/sinx/${messageBody}`, body: JSON.stringify(messageBody) });
    console.log(`messageBody`,JSON.stringify(messageBody));
  }

  subscribeSession(chatId: number,userId:number): void {
    const subscriptionUrl = `/chats/session/${chatId}`;

    this.subscription = this.stompClient.watch(subscriptionUrl).subscribe((message) => {
      const data = JSON.parse(message.body);
      console.log(`message.body`,JSON.stringify(message.body));
      const sessionData: Session = {
        id: data.id,
        action: data.action,
        time: data.time,
        pause: data.pause,
        currentTimeOnDevice: data.currentTimeOnDevice
      };

      this.sessionDataSubject.next(sessionData);
    });
    const subscriptionUser: SubscriptionUser = { chatId: chatId, userId: userId, subscription: this.subscription };
    this.activeSubscriptions.push(subscriptionUser);
    console.log('Новая подписка добавлена:', { userId: userId, subscription: this.subscription });
    console.log('Подписка пользователя:', this.subscription);
  }

  hasSubscriptionForUser(userId: number): boolean {
    return this.activeSubscriptions.some(sub => sub.userId === userId && !sub.subscription.closed);
  }

  unsubscribeUser(chatId: number, userId: number): void {
    const filteredSubscriptions = this.activeSubscriptions.filter(subscriptionUser => subscriptionUser.chatId === chatId 
      && subscriptionUser.userId === userId
    );

    if (filteredSubscriptions.length > 0) {
      filteredSubscriptions.forEach(filteredSubscription => {
        filteredSubscription.subscription.unsubscribe();
        console.log('Подписка пользователя с userId', userId, 'успешно отписана.');
      });
    }
    else {
      console.error('Подписка пользователя с userId', userId, 'не найдена.');
    }
    console.log('Оставшиеся подписки после отписки пользователя:', this.activeSubscriptions);
    console.log('Отписка чувака:', this.subscription);
  }

  unsubscribeAll(chatId: number): void {
    const filteredSubscriptions = this.activeSubscriptions.filter(subscriptionUser => subscriptionUser.chatId === chatId);

    if (filteredSubscriptions.length > 0) {
      filteredSubscriptions.forEach(filteredSubscription => {
          filteredSubscription.subscription.unsubscribe();
          console.log('Подписка пользователя с userId', filteredSubscription.userId, 'в чате', chatId, 'успешно отписана.');
      });
    }
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

