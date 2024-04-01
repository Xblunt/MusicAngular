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
export class ClientService extends IbaseServiceService {
  private clientUrlChats = 'chats';
  private clientUrlAlbum = 'album';
  private clientUrlTrack = 'tracks';
  private lkUrl = 'auth-user';
  private playlistUrl = 'playlist';


  constructor(http: HttpClient) {
    super(http, 'api/client');
  }

  getSession(chatId:number): Observable<Session>{
    let params = new HttpParams()
    .set("chatId", chatId)
    return this.get<Session>("client/session", params);
  }

  getTrackId(trackId:number):Observable<Track>{
    let params = new HttpParams()
    .set("trackIds", trackId);
    return this.get<Track>(`${this.clientUrlTrack}/send`, params);
  }

  getAllPageAlbums(page: number, size: number): Observable<Page<Album>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    return this.get<Page<Album>>(this.clientUrlAlbum, params);
  }

  getUserLK(authUserId: number): Observable<User> {
    const params = new HttpParams()
    .set('authUserId', authUserId);
    return this.get<User>(this.lkUrl, params);
  }

  getAllPageTracksAlbums(page: number,albumId: number, size: number): Observable<Page<Track>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    return this.get<Page<Track>>(`${this.clientUrlAlbum}/${albumId}/tracks`, params);
  }

  getAllPageTracks(page: number, size: number): Observable<Page<Track>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    return this.get<Page<Track>>(this.clientUrlTrack, params);
  }

  getShortUsers(page: number, size: number, authUserId: number): Observable<Page<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('authUserId', authUserId);
    return this.get<Page<User>>(`${this.clientUrlChats}/add`, params);
  }

  getPlaylist(page: number, size: number, authUserId: number): Observable<Page<Track>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('authUserId', authUserId);
    return this.get<Page<Track>>(this.playlistUrl, params);
  }

  like(pt: PlaylistTrack, authUserId: number, trackId: number): Observable<PlaylistTrack> {
    let params = new HttpParams()
    .set('authUserId', authUserId)
    .set('trackId', trackId);
    return this.post<PlaylistTrack>(this.playlistUrl, pt, params);
  }

}
