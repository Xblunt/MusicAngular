import { HomeService } from 'src/app/service/home.service';
import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  usernamell!: string ;
  user:  any[]=[];

  constructor(public dialog:MatDialog, public authService:AuthService, private adminService:AdminServiceService, private homeService:HomeService) {
    }

  ngOnInit(): void {
      const storedUsername = localStorage.getItem('username');
      this.usernamell = storedUsername !== null ? storedUsername : '';
      this.getUserLK();
  }


  getUserLK(): void {
    if (this.usernamell) {
      const username = this.usernamell;
      this.homeService.getUserLK(username).subscribe((users: User[]) => {
        console.log(`Before assigning users: ${ this.user}, ${users}`);
        this.user = users;
        console.log(`After assigning users: ${ this.user}, ${users}`);
      });
    }
    else {
      const username = this.authService.getUsername();
      this.homeService.getUserLK(username,).subscribe((users: User[]) => {
        this.user = [users];
      });
      this.usernamell = username;
    }
  }

}
