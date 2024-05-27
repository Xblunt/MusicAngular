import { Page } from 'src/app/model/page';
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
  private  adminUrl = 'users';
  private  adminUrlAlbum = 'album';
  private  adminUrlTrack = 'tracks';


  constructor(http: HttpClient) {
    super(http, 'api/admin');
  }

  getAllPageUsers(page: number, size: number): Observable<Page<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    return this.get<Page<User>>(this.adminUrl, params);
  }

  getAllPageAlbums(page: number, size: number): Observable<Page<Album>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    return this.get<Page<Album>>(this.adminUrlAlbum, params);
  }

  getAllPageTracksAlbums(page: number,albumId: number, size: number): Observable<Page<Track>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    return this.get<Page<Track>>(`${this.adminUrlAlbum}/${albumId}/tracks`, params);
  }

  getAllTracksAlbumsAdd(page: number, albumId: number, size: number): Observable<Page<Track>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    return this.get<Page<Track>>(`${this.adminUrlAlbum}/${albumId}/tracks/add`, params);
  }

  getAllPageTracks(page: number, size: number): Observable<Page<Track>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
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
    console.log("deleteUser:" + user.id);
    return this.delete<User>(`${this.adminUrl}/${user.id}`);
  }

  addNewTrack(track: Track): Observable<Track> {
    console.log(`addNewTrack: ${track.id},${track.name},${track.file},${track.author},${track.album_id},`);
    return this.post<Track>(`${this.adminUrlAlbum}/${track.album_id}/tracks`, track);
  }

  editTrack(track: Track): Observable<Track> {
    console.log(`editTrack: ${track.id},${track.name},${track.file},${track.author},${track.album_id},`);
    return this.put<Track>(`${this.adminUrlTrack}/${track.id}`, track);
  }

  editTrackAlbum(track: Track): Observable<Track> {
    console.log(`editTrackAlbum: ${track.id},${track.name},${track.file},${track.author},${track.album_id},`);
    return this.put<Track>(`${this.adminUrlAlbum}/${track.album_id}/tracks/add/${track.id}`, track);
  }

  deleteTrack(track: Track): Observable<Track> {
    console.log("deleteTrack:" + track.id);
    return this.delete<Track>(`${this.adminUrlTrack}/${track.id}`);
  }

  addNewAlbum(album: Album): Observable<Album> {
    console.log('addNewAlbum');
    return this.post<Album>(this.adminUrlAlbum, album);
  }

  editAlbum(album: Album): Observable<Album> {
    console.log('editAlbum');
    return this.put<Album>(`${this.adminUrlAlbum}/${album.id}`, album);
  }

  deleteUAlbum(album: Album): Observable<Album> {
    console.log("deleteUAlbum:" + album.id);
    return this.delete<Album>(`${this.adminUrlAlbum}/${album.id}`);
  }

}

