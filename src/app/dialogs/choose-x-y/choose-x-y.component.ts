import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-choose-x-y',
  templateUrl: './choose-x-y.component.html',
  styleUrls: ['./choose-x-y.component.scss']
})
export class ChooseXYComponent implements OnInit {

  data:string[]
  adminUsers:any
  xData:string[] = [];
  yData:string[] = [];

  dataChose = {}

  constructor(
    public thisDialogRef: MatDialogRef<ChooseXYComponent>
  ) { }

  ngOnInit() {
    // console.log(this.data)
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  closeDialog(){
    this.dataChose['xData']= this.xData
    this.dataChose['yData']= this.yData
    return this.thisDialogRef.close(this.dataChose)
  }

}