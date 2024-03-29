import { AdminServiceService } from 'src/app/service/admin-service.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Track } from 'src/app/model/track';
import { PageEvent } from '@angular/material/paginator';
import { Page } from 'src/app/service/page';
import { AuthService } from 'src/app/auth/auth.service';
import { ClientService } from 'src/app/service/client.service';
import { PlaylistTrack } from 'src/app/model/pt';

@Component({
  selector: 'app-open-album',
  templateUrl: './open-album.component.html',
  styleUrls: ['./open-album.component.css']
})
export class OpenAlbumComponent implements OnInit {
  currentPage: number = 0;
  pageSize: number = 2;
  totalElements: number = 0;
  idalbum: number;
  service: any;
  tracks: any[]=[];
  clickedUserId!: number;
  usernamell!: string ;
  pt: PlaylistTrack;
  isIconActive: boolean = false;

  constructor( public dialogRef: MatDialogRef<OpenAlbumComponent>,public dialog:MatDialog,  @Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService, public authService:AuthService, private clientService:ClientService) {
    this.idalbum = data.id;
    this.pt = new PlaylistTrack;
    if (this.authService.isAdmin()){
      this.service = this.adminService;
    }
    else if (this.authService.isStudent()){
      this.service = this.clientService;
    }
  }


  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.loadTracks();
  }


  loadTracks(): void {
    const albumId = this.idalbum;
    this.service.getAllTracksAlbums(this.currentPage, albumId ,this.pageSize
      ).subscribe( (response: Page<Track>) => {
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
      this.clientService.like(this.pt, username, trackId).subscribe(() => {
        this.loadTracks();
      });
    }
  }

}
