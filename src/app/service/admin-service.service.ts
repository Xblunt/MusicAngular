


import { Page } from 'src/app/service/page';
import { Observable } from 'rxjs';
import { IbaseServiceService } from './ibase-service.service';
import { User } from '../model/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from '../model/album';
import { Track } from '../model/track';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService extends IbaseServiceService {
  private  adminUrl = 'admin/users';
  private  adminUrlAl = 'admin/album';
  private  adminUrlTrack = 'admin/tracks';


  constructor(http: HttpClient) {
    super(http, 'api');
  }

  // override getUrl(): string {
  //   return this.adminUrl;
  // }

  getAllUsers(page: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection);
    return this.get<Page<User>>(this.adminUrl, params);
  }
  getAllAlbum(page: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Album>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection);
    return this.get<Page<Album>>(this.adminUrlAl, params);
  }
  getAllTracksAlbums(page: number,albumId: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Track>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set("sortColumn", sortColumn)
    .set("sortDirection", sortDirection);
    console.log(albumId);
    return this.get<Page<Track>>(`${this.adminUrlAl}/${albumId}/tracks`, params);
  }
  getAllTracksAlbumsAdd(page: number,trackId: number, albumId: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Track>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set("sortColumn", sortColumn)
    .set("sortDirection", sortDirection);
    console.log(albumId);
    return this.get<Page<Track>>(`${this.adminUrlAl}/${albumId}/tracks/add`, params);
  }
  getAllTrack(page: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Track>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection);
    return this.get<Page<Track>>(this.adminUrlTrack, params);
  }

  addNewUser(user: User): Observable<User> {
    console.log('addNewUser');
    return this.post<User>(this.adminUrl, user);
  }

  editUser(user: User): Observable<User> {
    console.log('editUser');
    return this.put<User>(`${this.adminUrl}/${user.id}`, user);
  }

  deleteUser(user: User): Observable<User> {
    console.log(user.id);
    return this.delete<User>(`${this.adminUrl}/${user.id}`);
  }



  addNewTrack(track: Track): Observable<Track> {
    console.log('addNewTrack');
    console.log(track.id);
    console.log(track.name);
    console.log(track.file);
    console.log(track.author);
    console.log(track.album_id);
    return this.post<Track>(`${this.adminUrlAl}/${track.album_id}/tracks`, track);
  }

  editTrack(track: Track): Observable<Track> {
    console.log('editTrack');
    console.log(track.id);
    console.log(track.name);
    console.log(track.file);
    console.log(track.author);
    console.log(track.album_id);
    return this.put<Track>(`${this.adminUrlTrack}/${track.id}`, track);
  }
  editTrackAlbum(track: Track): Observable<Track> {
    console.log('editTrack');
    console.log(track.id);
    console.log(track.name);
    console.log(track.file);
    console.log(track.author);
    console.log(track.album_id);
    return this.put<Track>(`${this.adminUrlAl}/${track.album_id}/tracks/add/${track.id}`, track);
  }
  deleteTrack(track: Track): Observable<Track> {
    console.log(track.id);
    return this.delete<Track>(`${this.adminUrlTrack}/${track.id}`);
  }
  addNewAlbum(album: Album): Observable<Album> {
    console.log('addNewAlbum');
    return this.post<Album>(this.adminUrlAl, album);
  }

  editAlbum(album: Album): Observable<Album> {
    console.log('editAlbum');
    return this.put<Album>(`${this.adminUrlAl}/${album.id}`, album);
  }

  deleteUAlbum(album: Album): Observable<Album> {
    console.log(album.id);
    return this.delete<Album>(`${this.adminUrlAl}/${album.id}`);
  }
}

