import { HomeService } from 'src/app/service/home.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/model/user';
import { MatTable} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements  AfterViewInit{

  usernamell!: string ;
  currentPage: number = 0;
  pageSize: number = 8;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user:  any[]=[];

  constructor(public dialog:MatDialog, public authService:AuthService, private adminService:AdminServiceService, private homeService:HomeService) {
    }
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;


  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
      const storedUsername = localStorage.getItem('username');
      this.usernamell = storedUsername !== null ? storedUsername : '';
      this.getUserLK();
      console.log("zzzz");
  }


  getUserLK(): void {
    if (this.usernamell) {
      const username = this.usernamell;
      this.homeService.getUserLK(username).subscribe((users: User[]) => {
        console.log('Before assigning users:', this.user);
        console.log('Before assigning users:', users);
        this.user = users;
        console.log('After assigning users:', this.user);
        console.log('After assigning users:', users);
      });
    }
    else {
      const username = this.authService.getUsername();
      this.homeService.getUserLK(username,).subscribe((users: User[]) => {
        console.log(users);
        this.user = [users];
      });
      this.usernamell = username;
    }
  }

}
