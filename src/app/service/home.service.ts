import { Injectable } from '@angular/core';
import { IbaseServiceService } from './ibase-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from './page';
import { Album } from '../model/album';
import { Track } from '../model/track';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { Chat } from '../model/chat';
import { Message } from '../model/message';
import { Pttt } from '../model/pt';
import { Session } from '../model/session';
@Injectable({
  providedIn: 'root'
})
export class HomeService extends IbaseServiceService {
  private  homeUrl = 'client/users';
  private  homeUrlAl = 'client/album';
  private  homeUrlTrack = 'client/tracks';
  private lkUrl = 'client/auth-user';
  private chats = 'client/chats';
  private play = 'client/playlist';


  constructor(http: HttpClient) {
    super(http, 'api');
  }

  getSession(chatId:number): Observable<Session>{
    let params = new HttpParams()
    .set("chatId", chatId)
    return this.get<Session>("client/session", params);
  }

  getAllAlbums(page: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Album>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("sortDirection", sortDirection);
    return this.get<Page<Album>>(this.homeUrlAl, params);
  }

  getUserLK(username: string): Observable<User[]> {
    const params = new HttpParams()
    .set('username', username);
    return this.get<User[]>(this.lkUrl, params);
  }

  getAllTracksAlbums(page: number,albumId: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Track>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set("sortColumn", sortColumn)
    .set("sortDirection", sortDirection);
    console.log(albumId);
    return this.get<Page<Track>>(`${this.homeUrlAl}/${albumId}/tracks`, params);
  }

  getAllTracks(page: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Track>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection);
    return this.get<Page<Track>>(this.homeUrlTrack, params);
  }

  editTrackAlbum(track: Track): Observable<Track> {
    console.log('editTrack');
    console.log(track.id);
    console.log(track.name);
    console.log(track.file);
    console.log(track.author);
    console.log(track.album_id);
    return this.put<Track>(`${this.homeUrlAl}/${track.album_id}/tracks/add/${track.id}`, track);
  }

  getChats(username: string): Observable<Chat[]> {
    let params = new HttpParams()
    .set('username', username);
    return this.get<Chat[]>(this.chats, params);
  }

  getAllMessages(page: number,chatId: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Message>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set("sortColumn", sortColumn)
    .set("sortDirection", sortDirection);
    console.log(chatId);
    return this.get<Page<Message>>(`${this.chats}/${chatId}`, params);
  }

  getTrackMessage(trackId: number): Observable<Track[]> {
    let params = new HttpParams()
    .set("trackId", trackId);
    return this.get<Track[]>(`${this.homeUrlTrack}/mess`, params);
  }

  getTrackId(trackId:number):Observable<Track>{
    let params = new HttpParams()
    .set("trackIds", trackId);
    return this.get<Track>(`${this.homeUrlTrack}/send`, params);
  }
  // updateSession(action: string, currentTime: number, chatId: number){
  //   // Формируем сообщение для отправки на сервер
  //   const message = {
  //     action: action,
  //     time: currentTime,
  //     chatId: chatId
  //   };

  //   // Отправляем сообщение на сервер через веб-сокет и ожидаем ответа
  //   this.webSocetServiceService.watch("/client/" + id).subscribe(() => {
  //     this.getCurrentOrder()
  //     .subscribe((data) => console.log("Reject from order " + data.id));
  //     });
  //     this.webSocetServiceService.publish({destination : "/customer/order/" + id, body: ORDER_ACTION_REQUEST.REJECT});
  //     }


  createMessage(mess: Message,chatId: number, usernmae: string, messgg: string): Observable<Message> {
    let params = new HttpParams()
    .set('username', usernmae)
    .set('messgg', messgg)
    console.log(chatId);
    return this.post<Message>(`${this.chats}/${chatId}`, mess, params);
  }

  CreateTrackMessage(mess: Message,chatId: number, usernmae: string, messgg: number): Observable<Message> {
    let params = new HttpParams()
    .set('username', usernmae)
    .set('messgg', messgg)
    console.log('rrrrrrr',chatId);
    return this.post<Message>(`${this.chats}/${chatId}/add`, mess, params);
  }

  getAllUsers(page: number, size: number, username: string, sortColumn: string, sortDirection: string): Observable<Page<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection)
      .set('username', username);
    return this.get<Page<User>>(`${this.chats}/add`, params);
  }

  getPlaylist(page: number, size: number, username: string, sortColumn: string, sortDirection: string): Observable<Page<Track>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection)
      .set('username', username);
    return this.get<Page<Track>>(this.play, params);
  }

  addNewChat(chat: Chat, username: string, secondId: number): Observable<Chat> {
    let params = new HttpParams()
    .set('username', username)
    .set('secondId', secondId);
    return this.post<Chat>(this.chats, chat,params);
  }

  like(pt: Pttt, username: string, trackId: number): Observable<Pttt> {
    let params = new HttpParams()
    .set('username', username)
    .set('trackId', trackId);
    return this.post<Pttt>(this.play, pt, params);
  }

}
