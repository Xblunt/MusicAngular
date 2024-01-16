

import { AdminServiceService } from 'src/app/service/admin-service.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { CredentialResponse } from 'src/app/auth/model/auth/credentialResponse';
import { User } from 'src/app/model/user';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { Page } from 'src/app/service/page';
import { Album } from 'src/app/model/album';
import { Track } from 'src/app/model/track';
import { EditComponent } from 'src/app/components/dialog/edit-component/edit/edit.component';
import { DeleteComponentComponent } from 'src/app/components/dialog/delete-component/delete-component/delete-component.component';
import { HomeService } from 'src/app/service/home.service';
import { Pttt } from 'src/app/model/pt';
@Component({
  selector: 'app-tracksc',
  templateUrl: './tracksc.component.html',
  styleUrls: ['./tracksc.component.css']
})
export class TrackscComponent implements  AfterViewInit{

  // displayedColumns: string[] = ['id', 'name', 'author', 'album_id',   'action'];

  // dataSource3 = new MatTableDataSource<Track>();
 tracks: any [] = [];
 selectedButton!: string;
  currentPage: number = 0;
  pageSize: number = 8;
  // active: string = 'user_id';
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user!: CredentialResponse;
  // album!: Album;
  fromTrackComponent: boolean = true;
  service: any;
  usernamell!: string ;
  pt: Pttt;
  clickedUserId!: number;
  isIconActive: boolean = false;
 constructor(private baseService: BaseServiceService, private _liveAnnouncer: LiveAnnouncer,
    public dialog:MatDialog, private http: HttpClient, public authService:AuthService, private adminService:AdminServiceService, private userService:HomeService) {
      // this.baseService.getAllStudents().subscribe(data => this.dataSource = new MatTableDataSource(data));
      if (this.authService.isAdmin()){
        this.service = this.adminService;
      }
      else {
        this.service = this.userService;
      }
      this.pt = new Pttt;
    }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.user = this.authService.LoggedUser;
  }
  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';

    this.getAllTrack();
    // this. getAllTracksAlbums(this.album);

  }

    getAllTrack( ): void {
      this.service.getAllTrack(this.currentPage, this.pageSize,  this.sortColumn,this.sortDirection)
        .subscribe((page: Page<Track>) => {
          console.log(page);
          this.tracks = page.content;

console.log(page.content);
          this.totalPages = page.totalPages;


          this.totalElements = page.totalElements;



          // this.tracks = this.sort;

        });

    }

    updatePageSizeTrack(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.getAllTrack();
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

        this.userService.like( this.pt, username, trackId ).subscribe((newpt: Pttt) => {
          this.getAllTrack();
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
            this.adminService.getAllTrack(this.currentPage, this.pageSize, this.sort.active,this.sort.direction).subscribe(data => this.tracks= data.content) );
        }
      });
    }
    editTrack(track: Track) {
      const dialogAddingNewStudent = this.dialog.open(EditComponent, {
        width: '700px',

        // data: {id: student.id, fio: student.fio, group: student.group, phoneNumber: student.phoneNumber}
       data: {id: track.id, album_id: track.album_id, name: track.name, author: track.author, text: track.text,   file: track.file,  fromTrackComponent: this.fromTrackComponent}
      // data: {student: student}
      });
      dialogAddingNewStudent.afterClosed().subscribe((editedTrack: Track) => {
        // debugger
        if(editedTrack  != null) {
        // debugger
          console.log("edit student: " + editedTrack.name);
          this.adminService.editTrack(editedTrack).subscribe(k=>
            this.adminService.getAllTrack(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.tracks = data.content) );
          }
          // this.adminService.getAllTrack(this.currentPage, this.pageSize, this.sort.active, this.sort.direction).subscribe(data => this.dataSource3.data = data.content);

        });
    }
    addNewTrack() {
      const dialogAddingNewStudent = this.dialog.open(EditComponent, {
        width: '700px',

        data: { fromTrackComponent: this.fromTrackComponent}
      });
      dialogAddingNewStudent.afterClosed().subscribe((result: Track) => {
        if(result != null) {
          console.log("adding new student: " + result.name);
          this.adminService.addNewTrack(result).subscribe(k=>
            this.adminService.getAllTrack(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.tracks = data.content) );
        }
      });
    }


}


