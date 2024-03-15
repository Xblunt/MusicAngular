import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Album } from 'src/app/model/album';
import { Track } from 'src/app/model/track';
import { User } from 'src/app/model/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent  implements OnInit {
  editingUser!: User;
  editingAlbum!: Album;
  editingTrack!: Track;
  isEditMode!: boolean;
  fromTrackComponent!: boolean;
  fromAlbumComponent!: boolean;
  fromUserComponent!: boolean;

  constructor(public dialogRef: MatDialogRef<EditComponent>,@Inject(MAT_DIALOG_DATA) public data:any, private adminService: AdminServiceService) {
        this.fromTrackComponent = this.data.fromTrackComponent;
        this.fromAlbumComponent = this.data.fromAlbumComponent;
        this.fromUserComponent = this.data.fromUserComponent;
    }


  ngOnInit(): void {
    this.isEditMode = this.data;
    this.editingUser = this.isEditMode ? this.data  : new User();
    this.editingAlbum = this.isEditMode ? this.data  : new Album();
    this.editingTrack = this.isEditMode ? this.data  : new Track();
  }


  onImageFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          console.log(reader.result)
          const base64Data = reader.result.substring(23);
          this.editingAlbum.picture = base64Data;
          console.log("Album picture:" + this.editingAlbum.picture);
        }
      };
      reader.readAsDataURL(file);
    }
  }


  onImageFileSelected2(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          console.log(reader.result)
          const base64Data = reader.result.substring(23);
          this.editingUser.photo = base64Data;
          console.log("User photo:" + this.editingUser.photo);
        }
      };
      reader.readAsDataURL(file);
    }
  }


  handleSongFileUpload(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          console.log(reader.result)
          const base64Data = reader.result.substring(reader.result.indexOf(',') + 1);
          this.editingTrack.file = base64Data;
          console.log("Track file:" + this.editingTrack.file);
        }
      };
      reader.readAsDataURL(file);
    }
  }


  highlightFileUpload(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  allowFileDrop(event: any) {
    event.preventDefault();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  onYesClick() {
    const editedUser: User = this.editingUser ;
    const editedAlbum: Album = this.editingAlbum ;
    const editedTrack: Track = this.editingTrack ;
    if (this.isEditMode) {
      if (this.fromTrackComponent) {

        this.dialogRef.close(editedTrack);
      } else if (this.fromAlbumComponent) {
        this.dialogRef.close(editedAlbum);
      } else if (this.fromUserComponent) {
        this.dialogRef.close(editedUser);
      }
    }
    else{
      if (this.fromTrackComponent) {
        this.adminService.addNewTrack(this.editingTrack);
        this.editingTrack = new Track();
        this.dialogRef.close(editedTrack);
      }
      else if (this.fromAlbumComponent) {
        this.adminService.addNewAlbum(this.editingAlbum);
        this.editingAlbum = new Album();
        this.dialogRef.close(editedAlbum);
      }
      else if (this.fromUserComponent) {
        this.adminService.addNewUser(this.editingUser);
        this.editingUser = new User();
        this.dialogRef.close(editedUser);
        }
      }
    }

}

