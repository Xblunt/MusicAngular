
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/model/user';
import { Page } from 'src/app/service/page';
import { DeleteComponentComponent } from '../../dialog/delete-component/delete-component/delete-component.component';
import { EditComponent } from '../../dialog/edit-component/edit/edit.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent   {

  dataSource4 = new MatTableDataSource<User>();

  currentPage: number = 0;
  pageSize: number = 7;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;

  fromUserComponent: boolean = true;
  users : any[]=[];

 constructor(public dialog:MatDialog, private http: HttpClient, private authService:AuthService, private adminService:AdminServiceService) {
    }

  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    this.getAllUsers();
  }


  getAllUsers( ): void {
    this.adminService.getAllUsers(this.currentPage, this.pageSize,  this.sortColumn,this.sortDirection).subscribe((page: Page<User>) => {
        console.log(page);
        this.users = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.dataSource4.sort = this.sort;
      });
  }


  updatePageSize(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllUsers();
  }


  deleteUser(user: User){
    const dialogAddingNewStudent = this.dialog.open(DeleteComponentComponent, {
      width: '1000px',
      data: null
    });
      dialogAddingNewStudent.afterClosed().subscribe((confirmDelete: boolean) => {
      if(confirmDelete == true) {
        console.log("delete user: ");
        this.adminService.deleteUser(user).subscribe(k=>
          this.adminService.getAllUsers(this.currentPage, this.pageSize, this.sort.active,this.sort.direction).subscribe(data => this.dataSource4.data= data.content) );
      }
    });
  }


  editUser(user: User) {
    const dialogAddingNewStudent = this.dialog.open(EditComponent, {
      width: '1000px',
      height: '300px',
      data: {id: user.id, fio: user.fio,  text: user.text,  date: user.date, photo: user.photo, fromUserComponent: this.fromUserComponent}
    });
    dialogAddingNewStudent.afterClosed().subscribe((editedUser: User) => {
      if(editedUser  != null) {
        console.log("edit user: " + user.fio);
        this.adminService.editUser(editedUser).subscribe(k=>
          this.adminService.getAllUsers(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.dataSource4.data = data.content) );
      }
    });
  }


  addNewUser() {
    const dialogAddingNewStudent = this.dialog.open(EditComponent, {
      width: '1000px',
      height: '300px',
      data:  { fromUserComponent: this.fromUserComponent}
    });
    dialogAddingNewStudent.afterClosed().subscribe((result: User) => {
      if(result != null) {
        console.log("adding new user: " + result.fio);
        this.adminService.addNewUser(result).subscribe(k=>
          this.adminService.getAllUsers(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.dataSource4.data = data.content) );
      }
    });
  }
}

