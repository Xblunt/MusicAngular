
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { CredentialResponse } from 'src/app/auth/model/auth/credentialResponse';
import { Message } from 'src/app/model/message';
import { Track } from 'src/app/model/track';
import { HomeService } from 'src/app/service/home.service';
import { Page } from 'src/app/service/page';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements  AfterViewInit{

  tracks: any [] = [];
  selectedButton!: string;
  currentPage: number = 0;
  pageSize: number = 8;
  sortColumn: string = 'id';
  sortDirection: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  length!: number;
  user!: CredentialResponse;
  usernamell!: string ;
  chatid: number;
  message: Message;

  constructor(public dialogRef: MatDialogRef<PlaylistComponent>,@Inject(MAT_DIALOG_DATA) public data:any, public dialog:MatDialog, public authService:AuthService,  private userService:HomeService) {
      this.message = new Message;
      this.chatid = this.data;
  }



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;



  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    this.usernamell = storedUsername !== null ? storedUsername : '';
    this.getPlaylist();
  }


  updatePageSizeTrack(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPlaylist();
  }


  getPlaylist( ): void {
    if (this.usernamell) {
      const username = this.usernamell;
      this.userService.getPlaylist(this.currentPage,  this.pageSize, username, this.sortColumn,this.sortDirection).subscribe((page: Page<Track>) => {
        console.log(page);
        this.tracks = page.content;
        console.log(page.content);
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
      });
    }
    else {
      const username = this.authService.getUsername();
      this.userService.getPlaylist(this.currentPage, this.pageSize, username, this.sortColumn,this.sortDirection).subscribe((page: Page<Track>) => {
        console.log(page);
        this.tracks = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
      });
    this.usernamell = username;
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  CreateTrackMessage(track:Track):void{
    const chatId = this.data;
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaa:::'+ chatId)
    const messgg =  track.id;
    const username = this.usernamell;
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaa:::'+ messgg)
    this.userService.CreateTrackMessage(this.message, chatId,username, messgg).subscribe(() => {
        this.getPlaylist();
      });
    this.getPlaylist();
  }

}
