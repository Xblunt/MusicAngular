import { AdminServiceService } from 'src/app/service/admin-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Page } from 'src/app/service/page';
import { Album } from 'src/app/model/album';
import { OpenAlbumComponent } from 'src/app/components/dialog/open-album/open-album/open-album.component';
import { DeleteComponentComponent } from 'src/app/components/dialog/delete-component/delete-component/delete-component.component';
import { EditComponent } from 'src/app/components/dialog/edit-component/edit/edit.component';
import { AddTrackAlbumComponent } from 'src/app/components/dialog/addTrackAlbum/add-track-album/add-track-album.component';
import { HomeService } from 'src/app/service/home.service';

@Component({
  selector: 'app-albumsc',
  templateUrl: './albumsc.component.html',
  styleUrls: ['./albumsc.component.css']
})
export class AlbumscComponent implements OnInit{

  albums: any[] = [];
  dataSource2 = new MatTableDataSource<Album>();

  currentPage: number = 0;
  pageSize: number = 8;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;


  fromAlbumComponent: boolean = true;
  service: any;

 constructor(public dialog:MatDialog, public authService:AuthService, private adminService:AdminServiceService, private homeService:HomeService) {
    if (this.authService.isStudent()){
      this.service = this.homeService;
    }
    else if (this.authService.isAdmin()){
      this.service = this.adminService;
    }
  }

  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    console.log(this.albums);
    this.getAllAlbums();
  }

  getAllAlbums( ): void {
    this.service.getAllAlbums(this.currentPage, this.pageSize,  this.sortColumn,this.sortDirection).subscribe((page: Page<Album>) => {
      console.log(page);
      this.albums = page.content;
      this.totalPages = page.totalPages;
      this.totalElements = page.totalElements;
      this.dataSource2.sort = this.sort;
    });
  }


  updatePageSizeAl(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllAlbums();
  }


  openAlbum(albumId: Album): void {
    const dialogRef = this.dialog.open(OpenAlbumComponent, {
      data: {id: albumId.id},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Changes saved:', result);
      } else {
        console.log('The window is closed without saving changes.');
      }
    });
  }


  deleteAlbum(album: Album){
    const dialogAddingNewStudent = this.dialog.open(DeleteComponentComponent, {
      width: '1000px',
      data: null
    });
      dialogAddingNewStudent.afterClosed().subscribe((confirmDelete: boolean) => {
      if(album != null) {
        console.log("delete album: ");
        this.adminService.deleteUAlbum(album).subscribe(k=>
          this.adminService.getAllAlbums(this.currentPage, this.pageSize, this.sort.active,this.sort.direction).subscribe(data => this.dataSource2.data= data.content) );
      }
    });
  }


  editAlbum(album: Album) {
    const dialogAddingNewStudent = this.dialog.open(EditComponent, {
      width: '700px',
      data: {id: album.id, name_album: album.name_album,  picture: album.picture, fromAlbumComponent: this.fromAlbumComponent}
    });
    dialogAddingNewStudent.afterClosed().subscribe((editedAlbum: Album) => {
      if(editedAlbum  != null) {
        console.log("edit album: " + album.name_album);
        this.adminService.editAlbum(editedAlbum).subscribe(k=>
          this.adminService.getAllAlbums(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.dataSource2.data = data.content) );
      }
    });
  }


  addNewAlbum() {
    const dialogAddingNewStudent = this.dialog.open(EditComponent, {
      width: '700px',
      data: {fromAlbumComponent: this.fromAlbumComponent}
    });
    dialogAddingNewStudent.afterClosed().subscribe((result: Album) => {
      if(result != null) {
        console.log("adding new album: " + result.name_album);
        this.adminService.addNewAlbum(result).subscribe(k=>
          this.adminService.getAllAlbums(this.currentPage, this.pageSize,  this.sort.active,this.sort.direction).subscribe(data => this.dataSource2.data = data.content) );
      }
    });
  }


  addtracks(album: Album): void {
    const dialogRef = this.dialog.open(AddTrackAlbumComponent, {
      data: { id: album.id},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Changes saved:', result);
      } else {
        console.log('The window is closed without saving changes.');
      }
    });
  }


}
