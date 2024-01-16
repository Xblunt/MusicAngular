import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { CredentialResponse } from 'src/app/auth/model/auth/credentialResponse';
import { Chat } from 'src/app/model/chat';
import { Message } from 'src/app/model/message';
import { Track } from 'src/app/model/track';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { HomeService } from 'src/app/service/home.service';
import { Page } from 'src/app/service/page';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements  AfterViewInit{
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }

  // displayedColumns: string[] = ['id', 'name', 'author', 'album_id',   'action'];

  // dataSource3 = new MatTableDataSource<Track>();
 tracks: any [] = [];
 selectedButton!: string;
  currentPage: number = 0;
  pageSize: number = 8;
  // active: string = 'user_id';
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user!: CredentialResponse;
  usernamell!: string ;
  chatid: number;
  message: Message;
  constructor(private baseService: BaseServiceService, private _liveAnnouncer: LiveAnnouncer,public dialogRef: MatDialogRef<PlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any, public dialog:MatDialog, private http: HttpClient, public authService:AuthService,  private userService:HomeService) {
    this.message = new Message;
      this.chatid = this.data;
    }



    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;


    ngOnInit(): void {
      const storedUsername = localStorage.getItem('username');
      this.usernamell = storedUsername !== null ? storedUsername : '';

      this.getPlaylist();


    }


//     getPlaylist( ): void {
//       this.userService.getAllTrack(this.currentPage, this.pageSize,  this.sortColumn,this.sortDirection)
//         .subscribe((page: Page<Track>) => {
//           console.log(page);
//           this.tracks = page.content;

// console.log(page.content);
//           this.totalPages = page.totalPages;


//           this.totalElements = page.totalElements;

//         });

//     }

    updatePageSizeTrack(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.getPlaylist();
    }

    getPlaylist( ): void {
      if (this.usernamell) {
        const username = this.usernamell;


        this.userService.getPlaylist(this.currentPage,  this.pageSize, username, this.sortColumn,this.sortDirection)
        .subscribe((page: Page<Track>) => {
          console.log(page);
          this.tracks = page.content;

console.log(page.content);
          this.totalPages = page.totalPages;


          this.totalElements = page.totalElements;

        });

      } else {
        const username = this.authService.getUsername();

        this.userService.getPlaylist(this.currentPage, this.pageSize, username, this.sortColumn,this.sortDirection)
        .subscribe((page: Page<Track>) => {
          console.log(page);
          this.tracks = page.content;


          this.totalPages = page.totalPages;


          this.totalElements = page.totalElements;

        });
        this.usernamell = username;

      }}

      onNoClick(): void {

        this.dialogRef.close();
       }
       Createmtrack(track:Track):void{
        localStorage.removeItem('trackId');
        const chatId = this.data;
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaa:::'+ chatId)
       const messgg =  track.id;
       localStorage.setItem('trackId', track.file);

    const username = this.usernamell;
       console.log('aaaaaaaaaaaaaaaaaaaaaaaaa:::'+ messgg)
       this.userService.createMTrack(this.message, chatId,username, messgg).subscribe(
        () => {
          this.getPlaylist();

        });



      }
  }
