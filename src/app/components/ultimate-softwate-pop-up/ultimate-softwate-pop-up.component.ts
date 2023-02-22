import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ultimate-softwate-pop-up',
  templateUrl: './ultimate-softwate-pop-up.component.html',
  styleUrls: ['./ultimate-softwate-pop-up.component.scss']
})
export class UltimateSoftwatePopUpComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public info: any
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(true);
  }
}
