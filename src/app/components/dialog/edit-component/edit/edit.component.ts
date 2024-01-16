
import { HttpClient } from '@angular/common/http';
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
  // selectedFile: File | null = null;
  // base64:any;
// albums:any[] = [];
  fromTrackComponent!: boolean;
  fromAlbumComponent!: boolean;
  fromUserComponent!: boolean;
  album: any= {};
  track: any = {};
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any, private formBuilder: FormBuilder, private adminService: AdminServiceService) {

        // this.editingUser = data;
        this.fromTrackComponent = this.data.fromTrackComponent;
        this.fromAlbumComponent = this.data.fromAlbumComponent;
        this.fromUserComponent = this.data.fromUserComponent;





    }
    // onInputChange(event:any){


    //   let targetEnent = event.target;

    //   let file:File = targetEnent.files[0];
    //   let fileReader:FileReader = new FileReader();
    //   fileReader.onload = (e) => {
    //     this.base64 = fileReader.result;
    //   }
    //   fileReader.readAsDataURL(file);
    // }

  ngOnInit(): void {
    this.isEditMode = this.data;
    this.editingUser = this.isEditMode ? this.data  : new User();
    this.editingAlbum = this.isEditMode ? this.data  : new Album();
    this.editingTrack = this.isEditMode ? this.data  : new Track();
    this.editingUser.fio = this.data.fio;
    // this.editingTrack.album_id = Number(this.editingTrack.album_id);
    // Assign the tracks data to the tracks array

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
          console.log(this.editingAlbum.picture);
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
          console.log(this.editingUser.photo);
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
          console.log(this.editingTrack.file);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  highlightFileUpload(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Добавьте стили для выделения области перетаскивания
    // Например, измените цвет фона или границы
  }
  unhighlightFileUpload(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Удалите стили выделения области перетаскивания
    // Верните оригинальные стили элемента
  }
  allowFileDrop(event: any) {
    event.preventDefault(); // Prevent default browser behavior for file drop
  }

//   onFileSelected(event: any): void {
//     this.selectedFile = event.target.files[0] as File;
//   }

// uploadTrack(): void {
//   if (this.selectedFile) {
//     const formData = new FormData();
//     formData.append('file', this.selectedFile);

//     this.http.post<any>('url-to-your-backend-endpoint', formData).subscribe(
//       (response) => {
//         console.log(response);
//         // Обработка успешной загрузки и сохранения трека
//       },
//       (error) => {
//         console.error(error);
//         // Обработка ошибки загрузки и сохранения трека
//       }
//     );
//   }
// }
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

            console.log(this.editingTrack);
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

