
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  // form: FormGroup;
  // lName: string;
  // lSurname: string;
  isEditMode!: boolean;

albums:Album[] = [];
  fromTrackComponent!: boolean;
  fromAlbumComponent!: boolean;
  fromUserComponent!: boolean;

  constructor(public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any, private formBuilder: FormBuilder, private adminService: AdminServiceService,) {

        // this.editingUser = data;
        this.fromTrackComponent = this.data.fromTrackComponent;
        this.fromAlbumComponent = this.data.fromAlbumComponent;
        this.fromUserComponent = this.data.fromUserComponent;



    }

  ngOnInit(): void {
    this.isEditMode = this.data;
    this.editingUser = this.isEditMode ? { ...this.data } : new User();
    this.editingAlbum = this.isEditMode ? { ...this.data } : new Album();
    this.editingTrack = this.isEditMode ? { ...this.data } : new Track();
    // Assign the tracks data to the tracks array

  }


  //   onYesClick() {
  //     // this.dialogRef.close(this.editingUser);
  //     const editedUser: User = { ...this.editingUser };
  //     // Проверяем, является ли пользователь новым или редактируемым
  //     if (this.isEditMode) {
  //       // Вызываем соответствующую функцию редактирования пользователя в UserComponent
  //       this.dialogRef.close(editedUser);
  //     } else {
  //       this.adminService.addNewUser(this.editingUser);
  //       this.editingUser = new User();
  //       this.dialogRef.close(editedUser);
  //     }
  //   }

   onNoClick(): void {

     this.dialogRef.close();
    }
    onYesClick() {
      const editedUser: User = { ...this.editingUser };
      const editedAlbum: Album = { ...this.editingAlbum };
      const editedTrack: Track = { ...this.editingTrack };

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


          this.dialogRef.close(this.editingAlbum);
        }
        else if (this.fromUserComponent) {
          this.adminService.addNewUser(this.editingUser);
            this.editingUser = new User();
            this.dialogRef.close(editedUser);
          }


        }
      }
    }

