

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
  getAllTrack(page: number, size: number, sortColumn: string, sortDirection: string): Observable<Page<Track>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection);
    return this.get<Page<Track>>(this.adminUrlTrack, params);
  }

  addNewUser(user: User): Observable<User> {
    console.log('addNewStudent');
    return this.post<User>(this.adminUrl, user);
  }

  editUser(user: User): Observable<User> {
    console.log('editStudent');
    return this.put<User>(`${this.adminUrl}/${user.id}`, user);
  }

  deleteUser(user: User): Observable<User> {
    console.log(user.id);
    return this.delete<User>(`${this.adminUrl}/${user.id}`);
  }
}
