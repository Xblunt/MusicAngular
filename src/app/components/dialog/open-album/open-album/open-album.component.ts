
import { AdminServiceService } from 'src/app/service/admin-service.service';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Track } from 'src/app/model/track';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Album } from 'src/app/model/album';
import { Page } from 'src/app/service/page';
import { AlbumscComponent } from 'src/app/components/basic-components/albums/albumsc/albumsc.component';
import { AddTrackAlbumComponent } from '../../addTrackAlbum/add-track-album/add-track-album.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { HomeService } from 'src/app/service/home.service';
import { Pttt } from 'src/app/model/pt';
import { Playlist } from 'src/app/model/playlist';
import { CredentialResponse } from 'src/app/auth/model/auth/credentialResponse';
// import { AlbumService } from 'src/app/service/album.service';

@Component({
  selector: 'app-open-album',
  templateUrl: './open-album.component.html',
  styleUrls: ['./open-album.component.css']
})
export class OpenAlbumComponent implements OnInit {
  // displayedColumns: string[] = ['id',  'name', 'author', 'action'];
  // displayedColumns2: string[] = ['action'];
  // displayedColumns: string[] = [  'nameAlbum', 'tracks'];
  // displayedColumns2: string[] = ['id', 'nameAlbum'];
  // displayedColumns: string[] = [ 'id', 'name', 'author'];
  // dataSource4 = new MatTableDataSource<Track>();
  //  dataSource5 = new MatTableDataSource<Album>();
  // dataSource4: any;
  // dataSource2 = new MatTableDataSource<Album>();
    // dataSource5: any;
  currentPage: number = 0;
  // selectedAlbum!: Album;
  pageSize: number = 2;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  idalbum: number;
  service: any;
  editingStudent: Track;
  trackId: number;
  tracks: any[]=[];
  clickedUserId!: number;
  usernamell!: string ;
  pt: Pttt;
  isIconActive: boolean = false;
  // user: CredentialResponse;
  // userId: number;
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<OpenAlbumComponent>,public dialog:MatDialog,  @Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService, public authService:AuthService, private homeService:HomeService) {
   this.idalbum = data.id;
   this.pt = new Pttt;
  //  this.user = new CredentialResponse;
  //  this.userId = this.user.id;
   this.editingStudent = new Track;
  this.trackId =  this.editingStudent.id;
   if (this.authService.isAdmin()){
    this.service = this.adminService;
  }
  else if (this.authService.isStudent()){
    this.service = this.homeService;
  }
    }

  ngOnInit(): void {
    // this.albumService.getSelectedAlbum().subscribe((album) => {
    //   this.album = album;
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';

    // });
    this.loadTracks();
  }



  loadTracks(): void {

    const albumId = this.idalbum;
    this.service.getAllTracksAlbums(this.currentPage, albumId ,this.pageSize,this.sortColumn,this.sortDirection
      )
      .subscribe( (response: Page<Track>) => {
          this.tracks = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.length = response.content.length;

      });
  }

    updatePageSizeTrackss(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadTracks();
  }
  close(): void {

    this.dialogRef.close();
   }

   handleUserButtonClick(track: Track): void {
    this.isIconActive = true;
    this.clickedUserId = track.id;

    this.like();
  }
   like(): void {
    const selectedUser = this.tracks.find(track => track.id === this.clickedUserId);

    if (selectedUser) {




     const trackId = selectedUser.id;
      const username = this.usernamell;

      this.homeService.like( this.pt, username, trackId ).subscribe((newpt: Pttt) => {
        this.loadTracks();
      });
    }
  }

  //  public onClickAddTrackPlaylist(updatedTrack: Track){
  //   // Код для установки значения свойства userId (например, из какого-то источника данных)

  //   // Передача свойства userId функции AddTrackPlaylist
  //   this.addTrackPlaylist(updatedTrack, this.userId);
  // }
// addTrackPlaylist(updatedTrack: Track){
//   const albumId = this.idalbum;
//   const updatedTrackId = updatedTrack.id;
//   // const userIdd = this.userId;
//   // updatedTrack.playlist_id = userIdd;

//   const editedTrack: Track = {
//     id: updatedTrack.id,
//     name: updatedTrack.name,
//     author: updatedTrack.author,
//     file: updatedTrack.file,
//     album_id: albumId,
//     text: updatedTrack.text,
//     // playlist_id: userIdd
//   };
// // Обновляем album_id в editingStudent
// console.log(editedTrack);
// this.service.editTrackAlbum(editedTrack).subscribe(()=>

// this.service.getAllTracksAlbums(this.currentPage, updatedTrackId, albumId ,this.pageSize,this.sortColumn,this.sortDirection
// )
// .subscribe( (response: Page<Track>) => {
//     this.dataSource4 = response.content;
//     this.totalElements = response.totalElements;
//     this.totalPages = response.totalPages;
//     this.length = response.content.length;

// }));

// }


  //  Addtracks(album: Album): void {
  //   const dialogRef = this.dialog.open(AddTrackAlbumComponent, {
  //     data: {id: album.id},
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result) {

  //       console.log('Изменения сохранены:', result);
  //     } else {

  //       console.log(' Окно закрыто без сохранения изменений.');
  //     }
  //   });
  // }
  // Addtracks(album: Album): void {
  //   const dialogRef = this.dialog.open(AddTrackAlbumComponent, {
  //     data: { id: album.id },
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result) {
  //       console.log('Изменения сохранены:', result);
  //     } else {
  //       console.log('Окно закрыто без сохранения изменений.');
  //     }
  //   });
  // }
  // getTracksByAlbum(albumId: number) {
  //   return this.dataSource4.filter(dataSource4 => dataSource4.albumId === albumId);
  // }

  // loadTracks(): void {
  //   const albumId = this.album.id;
  //   this.adminService.getAllTracksAlbums(
  //       this.currentPage,
  //       this.album.id,
  //       this.pageSize,
  //       this.sortColumn,
  //       this.sortDirection
  //     )
  //     .subscribe(
  //       (response: Page<Track>) => {
  //         this.dataSource3 = new MatTableDataSource(response.content);
  //         this.totalElements = response.totalElements;
  //         this.totalPages = response.totalPages;
  //         this.length = response.content.length;
  //       },
  //       (error) => {
  //         console.log('Ошибка при загрузке треков:', error);
  //       }
  //     );
  // }
}
