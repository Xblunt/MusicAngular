import { Injectable } from '@angular/core';
import { IbaseServiceService } from './ibase-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from './page';
import { Album } from '../model/album';
import { Track } from '../model/track';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { PlaylistTrack } from '../model/pt';
import { Session } from '../model/session';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends IbaseServiceService {
  private chats = 'client/chats';
  private  homeUrlAl = 'client/album';
  private  homeUrlTrack = 'client/tracks';
  private lkUrl = 'client/auth-user';
  private play = 'client/playlist';


  constructor(http: HttpClient) {
    super(http, 'api');
  }

  getSession(chatId:number): Observable<Session>{
    let params = new HttpParams()
    .set("chatId", chatId)
    return this.get<Session>("client/session", params);
  }

  getTrackId(trackId:number):Observable<Track>{
    let params = new HttpParams()
    .set("trackIds", trackId);
    return this.get<Track>(`${this.homeUrlTrack}/send`, params);
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

  like(pt: PlaylistTrack, username: string, trackId: number): Observable<PlaylistTrack> {
    let params = new HttpParams()
    .set('username', username)
    .set('trackId', trackId);
    return this.post<PlaylistTrack>(this.play, pt, params);
  }

}
