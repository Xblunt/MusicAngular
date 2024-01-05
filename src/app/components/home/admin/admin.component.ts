
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
import { DeleteComponentComponent } from '../../dialog/delete-component/delete-component/delete-component.component';
import { EditComponent } from '../../dialog/edit-component/edit/edit.component';
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
  fromUserComponent: boolean = true;
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

    deleteUser(user: User){
      const dialogAddingNewStudent = this.dialog.open(DeleteComponentComponent, {
        width: '700px',
        data: null
      });
       dialogAddingNewStudent.afterClosed().subscribe((confirmDelete: boolean) => {

        if(user != null) {
          console.log("delete student: ");
          this.adminService.deleteUser(user).subscribe(k=>
            this.adminService.getAllUsers(this.currentPage, this.pageSize, this.sort.active,this.sort.direction).subscribe(data => this.dataSource4.data= data.content) );
        }
      });
    }
    editUser(user: User) {
      const dialogAddingNewStudent = this.dialog.open(EditComponent, {
        width: '700px',
        // data: {id: student.id, fio: student.fio, group: student.group, phoneNumber: student.phoneNumber}
       data: {id: user.id, fio: user.fio,  text: user.text,  date: user.date, photo: user.photo, fromUserComponent: this.fromUserComponent}
      // data: {student: student}
      });
      dialogAddingNewStudent.afterClosed().subscribe((editedUser: User) => {
        // debugger
        if(editedUser  != null) {
        // debugger
          console.log("edit student: " + user.fio);
          this.adminService.editUser(editedUser).subscribe(k=>
            this.adminService.getAllUsers(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.dataSource4.data = data.content) );
        }
      });
    }
    addNewUser() {
      const dialogAddingNewStudent = this.dialog.open(EditComponent, {
        width: '700px',
        data:  { fromUserComponent: this.fromUserComponent}
      });
      dialogAddingNewStudent.afterClosed().subscribe((result: User) => {
        if(result != null) {
          console.log("adding new student: " + result.fio);
          this.adminService.addNewUser(result).subscribe(k=>
            this.adminService.getAllUsers(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.dataSource4.data = data.content) );
        }
      });
    }
}

