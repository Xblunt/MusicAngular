import { AdminServiceService } from 'src/app/service/admin-service.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Page } from 'src/app/service/page';
import { Album } from 'src/app/model/album';
import { OpenAlbumComponent } from 'src/app/components/dialog/open-album/open-album/open-album.component';
import { DeleteComponentComponent } from 'src/app/components/dialog/delete-component/delete-component/delete-component.component';
import { EditComponent } from 'src/app/components/dialog/edit-component/edit/edit.component';
import { AddTrackAlbumComponent } from 'src/app/components/dialog/addTrackAlbum/add-track-album/add-track-album.component';
import { ClientService } from 'src/app/service/client.service';

@Component({
  selector: 'app-albumsc',
  templateUrl: './albumsc.component.html',
  styleUrls: ['./albumsc.component.css']
})
export class AlbumscComponent implements OnInit{
  albums: any[] = [];
  pageSize: number = 8;
  currentPage: number = 0;
  fromAlbumComponent: boolean = true;
  service: any;

 constructor(public dialog:MatDialog, public authService:AuthService, private adminService:AdminServiceService, private clientService:ClientService) {
    if (this.authService.isStudent()){
      this.service = this.clientService;
    }
    else if (this.authService.isAdmin()){
      this.service = this.adminService;
    }
  }

  ngOnInit(): void {
    console.log(this.albums);
    this.getAllAlbums();
  }

  getAllAlbums( ): void {
    this.service.getAllPageAlbums(this.currentPage, this.pageSize).subscribe((page: Page<Album>) => {
      console.log(page);
      this.albums = page.content;
    });
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
          this.adminService.getAllPageAlbums(this.currentPage, this.pageSize).subscribe(data => this.albums = data.content) );
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
          this.adminService.getAllPageAlbums(this.currentPage, this.pageSize).subscribe(data => this.albums = data.content) );
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
          this.adminService.getAllPageAlbums(this.currentPage, this.pageSize).subscribe(data => this.albums = data.content) );
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
