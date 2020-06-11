import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {NgModel} from '@angular/forms';
import { environment } from '../../../environments/environment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent  {

  public _env:boolean;


  public httpStatus:number;
  public message:string;
  public details:string;
  // public trace:string;
  public id:string;

  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>) {
    if(environment.production === true){
      this._env = false;
    }else{
      this._env = true;
    }
   }

   onClose(){
    this.dialogRef.close(true);
  }


}
