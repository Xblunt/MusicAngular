

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
import { OpenAlbumComponent } from 'src/app/components/dialog/open-album/open-album/open-album.component';
// import { AlbumService } from 'src/app/service/album.service';

@Component({
  selector: 'app-albumsc',
  templateUrl: './albumsc.component.html',
  styleUrls: ['./albumsc.component.css']
})
export class AlbumscComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'nameAlbum', 'picture',  'action'];


  dataSource2 = new MatTableDataSource<Album>();

  currentPage: number = 0;
  pageSize: number = 8;
  // active: string = 'user_id';
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user!: CredentialResponse;
  selectedAlbum!: Album;
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


    this.getAllAlbum();

  }

  // selectAlbum(album: Album): void {
  //   this.selectedAlbum = album;
  //   this.albumService.setSelectedAlbum(album);
  // }
    getAllAlbum( ): void {
      this.adminService.getAllAlbum(this.currentPage, this.pageSize,  this.sortColumn,this.sortDirection)
        .subscribe((page: Page<Album>) => {
          console.log(page);
          this.dataSource2.data = page.content;

          this.totalPages = page.totalPages;


          this.totalElements = page.totalElements;



          this.dataSource2.sort = this.sort;

        });

    }

    updatePageSizeAl(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.getAllAlbum();
    }
    openAlbum(albumId: Album): void {
      const dialogRef = this.dialog.open(OpenAlbumComponent, {
        data: {id: albumId.id},
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {

          console.log('Изменения сохранены:', result);
        } else {

          console.log('Диалоговое окно закрыто без сохранения изменений.');
        }
      });
    }

}
