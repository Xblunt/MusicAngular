import { Component, Inject, OnInit } from '@angular/core';
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
  totalElements: number = 0;
  idalbum: number;
  editingStudent!: Track;
  tracks: any[]=[];

  constructor(public dialogRef: MatDialogRef<AddTrackAlbumComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService) {
    this.idalbum = data.id;
    this.editingStudent = new Track;
  }


  ngOnInit(): void {
    this.loadTracks();
  }


  loadTracks(): void {
    const albumId = this.idalbum;
    this.adminService.getAllTracksAlbumsAdd(this.currentPage, albumId ,this.pageSize,).subscribe( (response: Page<Track>) => {
          this.tracks = response.content;
          this.totalElements = response.totalElements;
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
        this.adminService.getAllTracksAlbumsAdd(this.currentPage, albumId ,this.pageSize).subscribe( (response: Page<Track>) => {
          this.tracks = response.content;
          this.totalElements = response.totalElements;
      }));
  }


}
