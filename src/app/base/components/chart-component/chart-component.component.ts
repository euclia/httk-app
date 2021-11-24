import { Component, OnInit, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ChartService, ChartOptions } from '../../../services/chart.service';


export interface DispFeats {
  name: string;
  completed: boolean;
  disable: boolean;
  color: ThemePalette;
  subtasks?: DispFeats[];
}
@Component({
  selector: 'app-chart-component',
  templateUrl: './chart-component.component.html',
  styleUrls: ['./chart-component.component.scss']
})
export class ChartComponentComponent implements OnInit {
  
  chartOptions: Partial<ChartOptions>;
  showChart: boolean = false;
  allComplete: boolean = false;
  chartFields = {};
  xaxis:string = ""
  data = {};
  allColumns:string[] = [];

  outFeats: DispFeats = {
    name: "Plot all species",
    completed: false,
    disable: false,
    color: "primary",
    subtasks: []
  }

  constructor( 
    private _charts: ChartService //JASON 11/10
    ) {}

  @Input() dataSource: { [key: string]: any; };

  ngOnInit(): void {
    this.dataSource.forEach(obj => {
      Object.keys(obj).forEach(key => {
        this.data[key] = (this.data[key] || []).concat([obj[key]]).map(Number);
      });
    });

    Object.keys(this.dataSource[0]).forEach(key => {
        this.outFeats.subtasks.push({
          name: key,
          completed: false,
          disable: false,
          color: "accent"
        })    
        this.allColumns.push(key)
    })
  }

  updateAllComplete() {
    this.allComplete = this.outFeats.subtasks != null && this.outFeats.subtasks.every(t => {
      let ret = true;
      if (!t.disable && !t.completed){
        ret = false;
      } 
      return ret
    });
  }

  someComplete(): boolean {
    if (this.outFeats.subtasks == null) {
      return false;
    }

    let chartCols = []
    if (this.xaxis!==""){
      chartCols = [this.xaxis]
    }

    this.outFeats.subtasks.forEach(t => {
        if (t.completed){
          chartCols.push(t.name);
      }
    });

    chartCols = chartCols.sort();

    if (JSON.stringify(chartCols)!==JSON.stringify(Object.keys(this.chartFields).sort())){
      this.renderPlot(this.xaxis,chartCols)  
    } 
    
    return this.outFeats.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.outFeats.subtasks == null) {
      return;
    }
    this.outFeats.subtasks.forEach(t => {
        if (!t.disable){
        t.completed = completed
      }
    });
  }

  renderPlot(xAxis:string, yAxis:string[]){
    this.chartFields = {}
    if (xAxis!=="" && xAxis!==null){
      this.chartFields[xAxis] = this.data[xAxis]
      if (yAxis.length>=2){
        yAxis.forEach(c => {
          this.chartFields[c] = this.data[c]      
        });
  
        this.chartOptions = this._charts.multipleLinesChart(this.chartFields,xAxis,"Predictions Plot",true, false)
  
        this.showChart = true;
      } else {
        this.showChart = false;
      }
    }
  }

  myChange(event) {

    this.outFeats.subtasks.find(function(task) {
      if(task.disable)
        task.disable = false
    });

   this.outFeats.subtasks.find(function(task) {
      if(task.name == event.value){
        task.completed = false
        task.disable = true
      }
    });

    delete this.chartFields[this.xaxis]
    let cols = Object.keys(this.chartFields);

    if (!this.allComplete){
      this.chartFields[event.value] = this.data[event.value]
    } else {

      this.outFeats.subtasks.find(function(task) {
        if(!task.disable && !task.completed)
          task.completed = true
      });
      cols = Object.keys(this.data);

      cols.forEach((element,index)=>{
        if(element==event.value) cols.splice(index,1);
     });
    }

    this.renderPlot(event.value,cols)  
    this.xaxis = event.value;
  }

}
