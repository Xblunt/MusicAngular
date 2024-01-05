
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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements  AfterViewInit{
  displayedColumns: string[] = ['id', 'fio',  'action'];


  dataSource4 = new MatTableDataSource<User>();


  currentPage: number = 0;
  pageSize: number = 2;
  // active: string = 'user_id';
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user!: CredentialResponse;

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

    this.getAllUser();


  }
    getAllUser( ): void {
      this.adminService.getAllUsers(this.currentPage, this.pageSize,  this.sortColumn,this.sortDirection)
        .subscribe((page: Page<User>) => {
          console.log(page);
          this.dataSource4.data = page.content;

          this.totalPages = page.totalPages;


          this.totalElements = page.totalElements;



          this.dataSource4.sort = this.sort;
// this.user = this.authService.LoggedUser;
// this.dataSource.paginator = this.paginator;
   // this.dataSource._updatePaginator(page.totalElements);
    // debugger;
          // this.currentPage = page.currentPage;
        });
      // this.authService.getUser().subscribe(data => this.dataSource.data = data);
    }

    updatePageSize(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.getAllUser();
    }



}

