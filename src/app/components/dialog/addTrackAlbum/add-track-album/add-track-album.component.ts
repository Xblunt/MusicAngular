import { Component, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Album } from 'src/app/model/album';
import { Track } from 'src/app/model/track';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { Page } from 'src/app/service/page';

@Component({
  selector: 'app-add-track-album',
  templateUrl: './add-track-album.component.html',
  styleUrls: ['./add-track-album.component.css']
})
export class AddTrackAlbumComponent implements OnInit {
  // @Output() track!: Track;
  displayedColumns: string[] = ['id', 'name', 'author', 'album_id', 'action'];
  // displayedColumns: string[] = [  'nameAlbum', 'tracks'];
  // displayedColumns2: string[] = ['id', 'nameAlbum'];
  // displayedColumns: string[] = [ 'id', 'name', 'author'];
  // dataSource4 = new MatTableDataSource<Track>();
  //  dataSource5 = new MatTableDataSource<Album>();
  dataSource3 = new MatTableDataSource<Track>();
    // dataSource5: any;
  currentPage: number = 0;

  pageSize: number = 2;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  idalbum: number;
  editingStudent!: Track;
   trackId: number;
  constructor(public dialogRef: MatDialogRef<AddTrackAlbumComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService) {
   this.idalbum = data.id;
   this.editingStudent = new Track;
  this.trackId =  this.editingStudent.id;
    }
    ngOnInit(): void {
      // this.albumService.getSelectedAlbum().subscribe((album) => {
      //   this.album = album;


      // });
      this.loadTracks();
    }



    loadTracks(): void {
      // const trackId =  track.id;
      const albumId = this.idalbum;
      this.adminService.getAllTracksAlbumsAdd(this.currentPage,this.trackId , albumId ,this.pageSize,this.sortColumn,this.sortDirection
        )
        .subscribe( (response: Page<Track>) => {
            this.dataSource3 = response.content;
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
     editalbumTrack(updatedTrack: Track): void {
      const albumId = this.idalbum;
      const updatedTrackId = updatedTrack.id;
      const oldAlbumId = updatedTrack.album_id;

      updatedTrack.album_id = albumId;

      const editedTrack: Track = {
        id: updatedTrack.id,
        name: updatedTrack.name,
        author: updatedTrack.author,
        file: updatedTrack.file,
        album_id: albumId,
        text: updatedTrack.text
      };
   // Обновляем album_id в editingStudent

   this.adminService.editTrackAlbum(editedTrack).subscribe(k=>

  this.adminService.getAllTracksAlbumsAdd(this.currentPage, updatedTrackId, albumId ,this.pageSize,this.sortColumn,this.sortDirection
    )
    .subscribe( (response: Page<Track>) => {
        this.dataSource3 = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.length = response.content.length;

    }));

 }


  }
