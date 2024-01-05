// import { Injectable } from '@angular/core';
// import { Album } from '../model/album';
// import { Observable, Subject } from 'rxjs';


// @Injectable({
//   providedIn: 'root'
// })
// export class AlbumService {
//   private selectedAlbumSubject: Subject<Album> = new Subject<Album>();
//   private selectedAlbum!: Album;

//   setSelectedAlbum(album: Album): void {
//     this.selectedAlbum = album;
//     this.selectedAlbumSubject.next(album);
//   }

//   getSelectedAlbum(): Observable<Album> {
//     return this.selectedAlbumSubject.asObservable();
//   }
// }
