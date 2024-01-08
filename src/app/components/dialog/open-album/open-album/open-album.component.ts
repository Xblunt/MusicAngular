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
// import { AlbumService } from 'src/app/service/album.service';

@Component({
  selector: 'app-open-album',
  templateUrl: './open-album.component.html',
  styleUrls: ['./open-album.component.css']
})
export class OpenAlbumComponent implements OnInit {
  displayedColumns: string[] = ['id',  'name', 'author', 'action'];
  displayedColumns2: string[] = ['action'];
  // displayedColumns: string[] = [  'nameAlbum', 'tracks'];
  // displayedColumns2: string[] = ['id', 'nameAlbum'];
  // displayedColumns: string[] = [ 'id', 'name', 'author'];
  // dataSource4 = new MatTableDataSource<Track>();
  //  dataSource5 = new MatTableDataSource<Album>();
  dataSource4: any;
  dataSource2 = new MatTableDataSource<Album>();
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

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<OpenAlbumComponent>,public dialog:MatDialog,  @Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService) {
   this.idalbum = data.id;
    }

  ngOnInit(): void {
    // this.albumService.getSelectedAlbum().subscribe((album) => {
    //   this.album = album;


    // });
    this.loadTracks();
  }



  loadTracks(): void {

    const albumId = this.idalbum;
    this.adminService.getAllTracksAlbums(this.currentPage, albumId ,this.pageSize,this.sortColumn,this.sortDirection
      )
      .subscribe( (response: Page<Track>) => {
          this.dataSource4 = response.content;
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
