import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User } from 'src/app/model/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';

@Component({
  selector: 'app-delete-component',
  templateUrl: './delete-component.component.html',
  styleUrls: ['./delete-component.component.css']
})
export class DeleteComponentComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<DeleteComponentComponent>,@Inject(MAT_DIALOG_DATA) public data: User, private adminService: AdminServiceService) {
  }


  ngOnInit(): void { }


  onNoClick(): void {
    this.dialogRef.close(false);
  }


  onYesClick(): void {
    this.dialogRef.close(true);
  }

}
