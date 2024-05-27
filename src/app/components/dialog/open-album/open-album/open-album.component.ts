import { AdminServiceService } from 'src/app/service/admin-service.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Track } from 'src/app/model/track';
import { PageEvent } from '@angular/material/paginator';
import { Page } from 'src/app/model/page';
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
  pt: PlaylistTrack;
  isIconActive: boolean = false;
  authUserId:number;

  constructor( public dialogRef: MatDialogRef<OpenAlbumComponent>,public dialog:MatDialog,  @Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService, public authService:AuthService, private clientService:ClientService) {
    this.authUserId = this.authService.getAuthUserId();
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
    this.loadTracks();
  }


  loadTracks(): void {
    this.service.getAllPageTracksAlbums(this.currentPage, this.idalbum ,this.pageSize
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
      this.clientService.like(this.pt, this.authUserId, selectedUser.id).subscribe(() => {
        this.loadTracks();
      });
    }
  }

}
