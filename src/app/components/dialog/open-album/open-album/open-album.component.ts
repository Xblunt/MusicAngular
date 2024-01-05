import { AdminServiceService } from 'src/app/service/admin-service.service';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Track } from 'src/app/model/track';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Album } from 'src/app/model/album';
import { Page } from 'src/app/service/page';
import { AlbumscComponent } from 'src/app/components/basic-components/albums/albumsc/albumsc.component';
// import { AlbumService } from 'src/app/service/album.service';

@Component({
  selector: 'app-open-album',
  templateUrl: './open-album.component.html',
  styleUrls: ['./open-album.component.css']
})
export class OpenAlbumComponent implements OnInit {
  // displayedColumns2: string[] = ['id',  'name', 'author', 'action'];
  displayedColumns: string[] = [  'nameAlbum', 'tracks'];
  // displayedColumns2: string[] = ['id', 'nameAlbum'];
  // displayedColumns: string[] = [ 'id', 'name', 'author'];
  // dataSource4 = new MatTableDataSource<Track>();
  //  dataSource5 = new MatTableDataSource<Album>();
  dataSource4: any;
    // dataSource5: any;
  currentPage: number = 0;

  pageSize: number = 2;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  idalbum: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService) {
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
  // getTracksByAlbum(albumId: number) {
  //   return this.dataSource4.filter(dataSource4 => dataSource4.albumId === albumId);
  // }
}
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
