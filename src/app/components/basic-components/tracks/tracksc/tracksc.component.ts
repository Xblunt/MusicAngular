

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


    // getAllTracksAlbums(album: Album ): void {

    //   this.adminService.getAllTracksAlbums(this.currentPage, album , this.pageSize,  this.sortColumn,this.sortDirection)
    //     .subscribe((page: Page<Track>) => {
    //       console.log(page);
    //       this.dataSource3.data = page.content;

    //       this.totalPages = page.totalPages;


    //       this.totalElements = page.totalElements;



    //       this.dataSource3.sort = this.sort;

    //     });

    // }

    // updatePageSizeALTrack(event: PageEvent): void {
    //   this.pageSize = event.pageSize;
    //   this.currentPage = event.pageIndex;
    //   this. getAllTracksAlbums(this.album);
    // }


}


