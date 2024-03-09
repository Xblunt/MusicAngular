import { Component, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Track } from 'src/app/model/track';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { Page } from 'src/app/service/page';

@Component({
  selector: 'app-add-track-album',
  templateUrl: './add-track-album.component.html',
  styleUrls: ['./add-track-album.component.css']
})
export class AddTrackAlbumComponent implements OnInit {

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
  tracks: any[]=[];

  constructor(public dialogRef: MatDialogRef<AddTrackAlbumComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService) {
    this.idalbum = data.id;
    this.editingStudent = new Track;
    this.trackId =  this.editingStudent.id;
  }


  ngOnInit(): void {
    this.loadTracks();
  }


  loadTracks(): void {
    const albumId = this.idalbum;
    this.adminService.getAllTracksAlbumsAdd(this.currentPage,this.trackId , albumId ,this.pageSize,this.sortColumn,this.sortDirection
      ).subscribe( (response: Page<Track>) => {
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


  editAlbumTrack(updatedTrack: Track): void {
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
      text: updatedTrack.text,
    };
    this.adminService.editTrackAlbum(editedTrack).subscribe(k=>
        this.adminService.getAllTracksAlbumsAdd(this.currentPage, updatedTrackId, albumId ,this.pageSize,this.sortColumn,this.sortDirection
      ).subscribe( (response: Page<Track>) => {
          this.tracks = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.length = response.content.length;
      }));
  }


}
