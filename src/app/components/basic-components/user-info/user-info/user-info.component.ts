import { ClientService } from 'src/app/service/client.service';
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
  user:  any;
  authUserId: number;

  constructor(public dialog:MatDialog, public authService:AuthService, private adminService:AdminServiceService, private clientService:ClientService) {
    this.authUserId = this.authService.getAuthUserId();
  }

  ngOnInit(): void {
      this.getUserLK();
  }


  getUserLK(): void {
    if (this.authUserId) {
      const authUserId = this.authUserId;
      this.clientService.getUserLK(authUserId).subscribe((user: User) => {
        console.log(`Before assigning users: ${ this.user}, ${user}`);
        this.user = user;
        console.log(`After assigning users: ${ this.user}, ${user}`);
      });
    }
  }

}
