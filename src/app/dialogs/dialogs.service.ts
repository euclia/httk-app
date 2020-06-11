import { ChooseXYComponent } from './choose-x-y/choose-x-y.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  constructor(private dialog: MatDialog,) { }
  public onError(error:HttpErrorResponse){
    let errorReport = error.error
    let dialogRef: MatDialogRef<ErrorDialogComponent>;
    dialogRef = this.dialog.open(ErrorDialogComponent);
    dialogRef.componentInstance.httpStatus = errorReport.httpStatus;
    dialogRef.componentInstance.details = errorReport.details;
    dialogRef.componentInstance.message = errorReport.message;
    return dialogRef.afterClosed();
}
public confirmDeletion(confirmationMessage:string, confirmationAction){
  let dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  dialogRef = this.dialog.open(ConfirmationDialogComponent);
  dialogRef.componentInstance.confirmationAction = confirmationAction
  dialogRef.componentInstance.confirmationMessage = confirmationMessage
  return dialogRef.afterClosed();
}
public chooseXY(data)
{
    let dialogRef: MatDialogRef<ChooseXYComponent>;
    dialogRef = this.dialog.open(ChooseXYComponent);
    dialogRef.componentInstance.data = data
    return dialogRef.afterClosed();
}
}
