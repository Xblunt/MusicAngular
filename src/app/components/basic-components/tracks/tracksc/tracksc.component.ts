

import { AdminServiceService } from 'src/app/service/admin-service.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-tracksc',
  templateUrl: './tracksc.component.html',
  styleUrls: ['./tracksc.component.css']
})
export class TrackscComponent implements  AfterViewInit{

  displayedColumns: string[] = ['id', 'name', 'author',  'action'];

  dataSource3 = new MatTableDataSource<Track>();

  currentPage: number = 0;
  pageSize: number = 2;
  // active: string = 'user_id';
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user!: CredentialResponse;
  // album!: Album;
  fromTrackComponent: boolean = true;
 constructor(private baseService: BaseServiceService, private _liveAnnouncer: LiveAnnouncer,
    public dialog:MatDialog, private http: HttpClient, private authService:AuthService, private adminService:AdminServiceService) {
      // this.baseService.getAllStudents().subscribe(data => this.dataSource = new MatTableDataSource(data));

    }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.user = this.authService.LoggedUser;
  }
  ngOnInit(): void {


    this.getAllTrack();
    // this. getAllTracksAlbums(this.album);

  }

    getAllTrack( ): void {
      this.adminService.getAllTrack(this.currentPage, this.pageSize,  this.sortColumn,this.sortDirection)
        .subscribe((page: Page<Track>) => {
          console.log(page);
          this.dataSource3.data = page.content;

          this.totalPages = page.totalPages;


          this.totalElements = page.totalElements;



          this.dataSource3.sort = this.sort;

        });

    }

    updatePageSizeTrack(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.getAllTrack();
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
            this.adminService.getAllTrack(this.currentPage, this.pageSize, this.sort.active,this.sort.direction).subscribe(data => this.dataSource3.data= data.content) );
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
          console.log("edit student: " + track.name);
          this.adminService.editTrack(editedTrack).subscribe(k=>
            this.adminService.getAllTrack(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.dataSource3.data = data.content) );
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
          console.log("adding new student: " + result.name);
          this.adminService.addNewTrack(result).subscribe(k=>
            this.adminService.getAllTrack(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.dataSource3.data = data.content) );
        }
      });
    }


}


