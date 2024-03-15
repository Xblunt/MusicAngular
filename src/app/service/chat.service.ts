import { EventEmitter, Injectable } from '@angular/core';
import { Message } from '../model/message';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IbaseServiceService } from './ibase-service.service';
import { Page } from './page';
import { Observable } from 'rxjs';
import { Chat } from '../model/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends IbaseServiceService{
  private chats = 'client/chats';

  eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(http: HttpClient) {
    super(http, 'api');
  }

  setSelectChat(selectedChat: any) {
    this.eventEmitter.emit(selectedChat);
  }

  getChats(username: string): Observable<Chat[]> {
    let params = new HttpParams()
    .set('username', username);
    return this.get<Chat[]>(this.chats, params);
  }

  addNewChat(chat: Chat, username: string, secondId: number): Observable<Chat> {
    let params = new HttpParams()
    .set('username', username)
    .set('secondId', secondId);
    return this.post<Chat>(this.chats, chat,params);
  }

  getAllMessages(chatId: number, size: number): Observable<Page<Message>> {
    let params = new HttpParams()
    .set('size', size.toString())
    return this.get<Page<Message>>(`${this.chats}/${chatId}`, params);
  }

  createMessage(mess: Message,chatId: number, username: string, messgg: string): Observable<Message> {
    let params = new HttpParams()
    .set('username', username)
    .set('messgg', messgg)
    console.log("CreateMessage on chat:" + chatId);
    return this.post<Message>(`${this.chats}/${chatId}`, mess, params);
  }

  createTrackMessage(mess: Message,chatId: number, usernmae: string, messgg: number): Observable<Message> {
    let params = new HttpParams()
    .set('username', usernmae)
    .set('messgg', messgg)
    return this.post<Message>(`${this.chats}/${chatId}/add`, mess, params);
  }

}
