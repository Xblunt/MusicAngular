import { HomeService } from 'src/app/service/home.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/model/user';
import { Page } from 'src/app/service/page';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements  AfterViewInit{
  // dataSource2 = new MatTableDataSource<User>();
  usernamell!: string ;
  currentPage: number = 0;
  pageSize: number = 8;
  // active: string = 'user_id';
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user:  any[]=[];

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
  this.usernamell = storedUsername !== null ? storedUsername : '';


    this.getUserLK();
    console.log("zzzz");
    // console.log(this.users);
  }
  constructor(private baseService: BaseServiceService, private _liveAnnouncer: LiveAnnouncer,
    public dialog:MatDialog, private http: HttpClient, public authService:AuthService, private adminService:AdminServiceService, private homeService:HomeService) {


    }
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
//     getUserLK(): void {
//
//  this.user1 = new User;
//       this.user1.username= this.authService.getUsername();
//  const username = this.user1.username;

//        this.homeService.getUserLK(this.currentPage, this.pageSize,username , this.sortColumn, this.sortDirection)
//         .subscribe((page: Page<User>) => {
//           this.users = page.content;
//           this.totalPages = page.totalPages;
//           this.totalElements = page.totalElements;
//
//         });
//     }

getUserLK(): void {
  if (this.usernamell) {
    const username = this.usernamell;

    this.homeService.getUserLK(username).subscribe((users: User[]) => {
      console.log('Before assigning users:', this.user);
      console.log('Before assigning users:', users);
      this.user = users; // Assuming there is only one user object in the array
      console.log('After assigning users:', this.user);
      console.log('After assigning users:', users);
    });

  } else {
    const username = this.authService.getUsername();

    this.homeService.getUserLK(username,).subscribe((users: User[]) => {
      console.log(users);
      this.user = [users]; // Assuming there is only one user object in the array
    });

    this.usernamell = username;
  }
}

}
