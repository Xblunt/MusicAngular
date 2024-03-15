import { AdminServiceService } from 'src/app/service/admin-service.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Page } from 'src/app/service/page';
import { Track } from 'src/app/model/track';
import { EditComponent } from 'src/app/components/dialog/edit-component/edit/edit.component';
import { DeleteComponentComponent } from 'src/app/components/dialog/delete-component/delete-component/delete-component.component';
import { HomeService } from 'src/app/service/home.service';
import { PlaylistTrack } from 'src/app/model/pt';

@Component({
  selector: 'app-tracksc',
  templateUrl: './tracksc.component.html',
  styleUrls: ['./tracksc.component.css']
})
export class TrackscComponent  {
  tracks: any [] = [];
  currentPage: number = 0;
  pageSize: number = 8;
  totalElements: number = 0;
  fromTrackComponent: boolean = true;
  service: any;
  usernamell!: string ;
  pt: PlaylistTrack;
  clickedUserId!: number;
  isIconActive: boolean = false;

 constructor(public dialog:MatDialog, public authService:AuthService, private adminService:AdminServiceService, private userService:HomeService) {
      if (this.authService.isAdmin()){
        this.service = this.adminService;
      }
      else {
        this.service = this.userService;
      }
      this.pt = new PlaylistTrack;
  }


  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.getAllTracks();
  }

  getAllTracks( ): void {
    this.service.getAllTracks(this.currentPage, this.pageSize)
      .subscribe((page: Page<Track>) => {
        console.log(page);
        this.tracks = page.content;
        this.totalElements = page.totalElements;
      });
  }

  updatePageSizeTrack(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllTracks();
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
      this.userService.like( this.pt, username, trackId ).subscribe((newpt: PlaylistTrack) => {
        this.getAllTracks();
      });
    }
  }


  deleteTrack(track: Track){
    const dialogAddingNewStudent = this.dialog.open(DeleteComponentComponent, {
      width: '700px',
      data: null
    });
      dialogAddingNewStudent.afterClosed().subscribe((confirmDelete: boolean) => {
      if(track != null) {
        console.log("delete track: ");
        this.adminService.deleteTrack(track).subscribe(k=>
          this.adminService.getAllTracks(this.currentPage, this.pageSize).subscribe(data => this.tracks= data.content) );
      }
    });
  }


  editTrack(track: Track) {
    const dialogAddingNewStudent = this.dialog.open(EditComponent, {
      width: '700px',
      data: {id: track.id, album_id: track.album_id, name: track.name, author: track.author, text: track.text,   file: track.file,  fromTrackComponent: this.fromTrackComponent}
    });
    dialogAddingNewStudent.afterClosed().subscribe((editedTrack: Track) => {
      if(editedTrack  != null) {
        console.log("edit track: " + editedTrack.name);
        this.adminService.editTrack(editedTrack).subscribe(k=>
          this.adminService.getAllTracks(this.currentPage, this.pageSize).subscribe(data => this.tracks = data.content) );
        }
      });
  }


  addNewTrack() {
    const dialogAddingNewStudent = this.dialog.open(EditComponent, {
      width: '700px',
      data: { fromTrackComponent: this.fromTrackComponent}
    });
    dialogAddingNewStudent.afterClosed().subscribe((result: Track) => {
      if(result != null) {
        console.log("adding new track: " + result.name);
        this.adminService.addNewTrack(result).subscribe(k=>
          this.adminService.getAllTracks(this.currentPage, this.pageSize).subscribe(data => this.tracks = data.content) );
      }
    });
  }



}


