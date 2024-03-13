import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-delete-component',
  templateUrl: './delete-component.component.html',
  styleUrls: ['./delete-component.component.css']
})
export class DeleteComponentComponent {


  constructor(public dialogRef: MatDialogRef<DeleteComponentComponent>,@Inject(MAT_DIALOG_DATA) public data: User) {
  }


  onNoClick(): void {
    this.dialogRef.close(false);
  }


  onYesClick(): void {
    this.dialogRef.close(true);
  }

}
