
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

  currentPage: number = 0;
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

  constructor( public dialogRef: MatDialogRef<OpenAlbumComponent>,public dialog:MatDialog,  @Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService, public authService:AuthService, private homeService:HomeService) {
    this.idalbum = data.id;
    this.pt = new Pttt;
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
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.loadTracks();
  }


  loadTracks(): void {
    const albumId = this.idalbum;
    this.service.getAllTracksAlbums(this.currentPage, albumId ,this.pageSize,this.sortColumn,this.sortDirection
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

}
