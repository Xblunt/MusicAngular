import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Message } from 'src/app/model/message';
import { Track } from 'src/app/model/track';
import { ChatService } from 'src/app/service/chat.service';
import { ClientService } from 'src/app/service/client.service';
import { Page } from 'src/app/service/page';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent {
  tracks: any [] = [];
  currentPage: number = 0;
  pageSize: number = 8;
  totalElements: number = 0;
  usernamell!: string ;
  message: Message;

  constructor(public dialogRef: MatDialogRef<PlaylistComponent>,@Inject(MAT_DIALOG_DATA) public data:any, public dialog:MatDialog, public authService:AuthService,  private userService:ClientService, private chatService: ChatService) {
      this.message = new Message;
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
      this.userService.getPlaylist(this.currentPage,  this.pageSize, username).subscribe((page: Page<Track>) => {
        this.tracks = page.content;
        console.log(page.content);
        this.totalElements = page.totalElements;
      });
    }
    else {
      const username = this.authService.getUsername();
      this.userService.getPlaylist(this.currentPage, this.pageSize, username).subscribe((page: Page<Track>) => {
        this.tracks = page.content;
        console.log(page.content);
        this.totalElements = page.totalElements;
      });
    this.usernamell = username;
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  createTrackMessage(track:Track):void{
    const chatId = this.data;
    console.log('chatId:'+ chatId)
    const trackIds =  track.id;
    const username = this.usernamell;
    console.log('this track ids:'+ trackIds)
    this.chatService.createTrackMessage(this.message, chatId, username, trackIds).subscribe(() => {
        this.getPlaylist();
      });
  }

}
