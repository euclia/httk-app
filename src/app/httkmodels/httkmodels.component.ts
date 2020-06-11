import { Dataset } from './../jaqpot-client/model/dataset';
import { Model } from './../jaqpot-client/model/model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';
import { DatasetService } from '../jaqpot-client/api/dataset.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { ModelApiService } from '../jaqpot-client/api/model.service';

@Component({
  selector: 'app-httkmodels',
  templateUrl: './httkmodels.component.html',
  styleUrls: ['./httkmodels.component.scss']
})
export class HttkmodelsComponent implements OnInit {

  totalFound = 0;
  models_to_view = []
  start = 0;
  max = 10;
  viewPrediction = false 
  actualPredicted:Dataset
  pageEvent:any

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _modelApi:ModelApiService,
    private _datasetApi:DatasetService,
    private _dialogsService:DialogsService
  ) { }

  ngOnInit() {
    this.fetchHttkModels(0, 20)
    
  }

  fetchHttkModels(min:Number, max:Number){
    this.models_to_view = []
    let params = new HttpParams().set("start", min.toString()).set("max", max.toString()).set("byAlgorithm", "httk");
    this._modelApi.getList(params).subscribe((models:Model[]) => {
      this.models_to_view = models
    })
    this._modelApi.count(params).subscribe((resp:Response) =>{
      this.totalFound = Number(resp.headers.get('total'));
    })
  }

  panelOpened(model){
    let id = model._id
    let params = new HttpParams().set('byModel', id)
    this._datasetApi.getList(params).subscribe((dataset:Dataset[])=>{
      if(dataset && dataset.length > 0){
        this.actualPredicted = dataset[0]
        this.viewPrediction = true
      }
    })
  }

  panelClosed(model){
    this.actualPredicted = null
    this.viewPrediction = false;
  }

  delete(model){
    this._dialogsService.confirmDeletion("Model will be deleted", "Sure?").subscribe(resp =>{
      if(resp === true){
        this._modelApi.deleteEntityWithID(model._id).subscribe(resp =>{
          this.ngOnInit()
        })
      }
    })
  }

  onPaginateChange(event){
    let start = this.paginator.pageIndex * this.paginator.pageSize;
    let size = this.paginator.pageSize;
    this.fetchHttkModels(start, size);
  }

}
