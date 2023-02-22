import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-pop-up',
  templateUrl: './success-pop-up.component.html',
  styleUrls: ['./success-pop-up.component.scss']
})
export class SuccessPopUpComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public info: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close(true);
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(true);
  }

}
