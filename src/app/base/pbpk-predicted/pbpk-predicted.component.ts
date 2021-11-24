import { DataEntry } from './../../jaqpot-client/model/dataEntry';
import { ErrorReport } from './../../jaqpot-client/model/errorReport';
import { FeatureInfo } from './../../jaqpot-client/model/featureInfo';
import { Feature } from './../../jaqpot-client/model/feature';
import { Dataset } from './../../jaqpot-client/model/dataset';
import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { FeatureApiService } from '../../jaqpot-client/api/feature.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription, merge, of, Subject, BehaviorSubject } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { DatasetToViewdataService } from '../../services/dataset-to-viewdata.service';
import { DatasourceToCsvService } from '../../services/table-to-csv.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pbpk-predicted',
  templateUrl: './pbpk-predicted.component.html',
  styleUrls: ['./pbpk-predicted.component.scss']
})
export class PbpkPredictedComponent implements OnChanges {

  @Input() predictedDataset: Dataset;

  displayedColumns:string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  subscription:Subscription;
  isLoading:boolean = true;

  viewPredOnly:boolean = true;
  viewAll:boolean = false;

  isLoadingResults:boolean = true;
  dataSource:{ [key: string]: any; } = {};
  data_available:boolean = false;


  totalRows:number;
  features:Feature[] = [];

  allFeatures:string[] = [];
  predictedFeature:string[] = [];

  datasetForChart:Dataset
  datasetDownloaded = new BehaviorSubject<boolean>(false);

  creatingPlotData:boolean = false;
  createdPlotData:boolean = false;
  xPlot
  yPlot
  showData = []

  constructor(
    private featureApi:FeatureApiService,
    private datasetApi:DatasetService,
    private datasetViewService:DatasetToViewdataService,
    private datasourceToCsvService:DatasourceToCsvService,
    private dialogsService:DialogsService
  ) { }

  ngOnChanges() {
    this.totalRows = this.predictedDataset.totalRows;
    this.data_available = false;
    this.isLoadingResults = true;
    // console.log(this.predictedDataset)
    this.displayedColumns.push('Id')
    this.predictedDataset.features.forEach(fi => {
      this.displayedColumns.push(fi.name)
      this.allFeatures.push(fi.name)
      if(fi.category === FeatureInfo.CategoryEnum.PREDICTED){
        this.predictedFeature.push(fi.name)
      }
    })
    this.predictedDataset.features.forEach((fi:FeatureInfo)=>{
      let _uri:string = fi.uri
      let _stringSplitted = _uri.split("/")
      let featId = _stringSplitted[_stringSplitted.length - 1]
      if(featId != 'doa'){
        this.featureApi.getWithIdSecured(featId).subscribe((feat:Feature)=>{
          this.features.push(feat)
        })
      }
    })
    // this.datasetApi.getDataEntryPaginated(this.predictedDataset._id, 0 , 30).subscribe((d:Dataset)=>{
    //   this.datasetForChart = d
    //   this.getWholeDataset(this.predictedDataset._id, 30 , 30)
    // })
    // console.log(this.datasetForChart)


  }

  ngAfterViewInit(){
    merge(this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() =>{
        this.isLoadingResults = true;
        this.data_available = false;
        this.isLoading = true;
        let offset = 0
        let size = 30
        if(this.paginator['_isInitialized'] === false){
          offset = 0
          size = 30
        }else{
          offset = this.paginator.pageSize * this.paginator.pageIndex
          size = this.paginator.pageSize
        }
        return this.datasetApi.getDataEntryPaginated(this.predictedDataset._id, offset, size);
      } ),
      map(data =>{
        return data
      }),
      catchError(err =>{
        return of([])
      })
    ).subscribe((data:Dataset) => {
      this.dataSource = this.datasetViewService.createViewData(data , 10);
      this.data_available = true;
      this.isLoadingResults = false;
      
    })
  }

  viewOnlyPred(){
    this.displayedColumns = []
    this.displayedColumns.push('Id')
    this.predictedFeature.forEach(featname =>{
      this.displayedColumns.push(featname)
    })
    this.viewPredOnly = false;
    this.viewAll = true;
  }

  viewAllB(){
    this.displayedColumns = []
    this.displayedColumns.push('Id')
    this.allFeatures.forEach(featname =>{
      this.displayedColumns.push(featname)
    })

    this.viewPredOnly = true;
    this.viewAll = false;
  }

  downloadTemplate(){
    var csvData:string = "";

      let i = 0;
      this.allFeatures.forEach((feat:string)=>{
        if(i != 0){
          csvData = csvData.concat("," + feat)
        }
        else{
          csvData = csvData.concat(feat)
        }
       i += 1;
      })
      csvData = csvData.concat("\n")
      // this.dataSource

    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    if(navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, "dataset.csv");
    } else {
      var a = document.createElement("a");
      a.href = url;
      a.download = 'dataset.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

  downloadB(){

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      useBom: true,
      headers: this.displayedColumns.slice()
    };

    this.datasourceToCsvService.createAndDownload(this.dataSource, "predicted_dataset", options);
  }

  async plotsStart(){
    let dataVals = []
    for(let key in this.dataSource[0]){
      dataVals.push(key)
    }

    delete this.xPlot;
    delete this.yPlot;
    this.dialogsService.chooseXY(dataVals).subscribe(XYS =>{
      this.creatingPlotData = true;
      this.datasetApi.getDataEntryPaginated(this.predictedDataset._id, 0 , 30).subscribe((d:Dataset)=>{
        this.datasetForChart = d
        this.getWholeDataset(this.predictedDataset._id, 30 , 30)
      })
      this.datasetDownloaded.subscribe(da => {
        if(da === true){
          let xFeat:string[] = XYS['xData']
          let yFeat:string[] = XYS['yData']
          let x = {}
          if(xFeat.length > 1 || yFeat.length === 0){
            let init ={}
            let report = <ErrorReport>{}
            report.details = "Wrong X val. Should be 1";
            report.httpStatus = 400;
            report.message = "X should be single value and y should at least be one";
            init['error'] = report;
            let errorToHttp: HttpErrorResponse = new HttpErrorResponse(init);
            this.dialogsService.onError(errorToHttp)
          }
          let xKey = ''
          let yKeys = {}
          this.datasetForChart.features.forEach((f:FeatureInfo)=>{
            if(f.name ===  xFeat[0]){
              xKey = f.key
            }
            if(yFeat.includes( f.name) ){
              yKeys[f.name] = f.key
            }

          })
          let xs = {}
          let xArr = []
          let ys = {}
          for ( let key in yKeys ){
            ys[key] = []
          }
          this.datasetForChart.dataEntry.forEach((de:DataEntry)=>{
            for (let key in de.values){
              if(key === String(xKey)){
                xArr.push(de.values[key])
              }
              for(let ykey in yKeys){
                if(yKeys[ykey] === key){
                  ys[ykey].push(de.values[key])
                }
              }
            }
            xs[xFeat[0]] = xArr 
          })
          this.creatingPlotData = false
          this.createdPlotData = true;
          this.xPlot = xs
          this.yPlot = ys
        }
      })
    })
  }

  async plotsStart2(){
    let dataVals = []
    for(let key in this.dataSource[0]){
      dataVals.push(key)
    }

    // delete this.xPlot;
    // delete this.yPlot;
    // this.dialogsService.chooseXY(dataVals).subscribe(XYS =>{
      this.creatingPlotData = true;
      this.datasetApi.getDataEntryPaginated(this.predictedDataset._id, 0 , 30).subscribe((d:Dataset)=>{
        this.datasetForChart = d
        this.getWholeDataset(this.predictedDataset._id, 30 , 30)
      })
      this.datasetDownloaded.subscribe(da => {
        if(da === true){
          // let xFeat:string[] = XYS['xData']
          // let yFeat:string[] = XYS['yData']
          let x = {}
          // if(xFeat.length > 1 || yFeat.length === 0){
          //   let init ={}
          //   let report = <ErrorReport>{}
          //   report.details = "Wrong X val. Should be 1";
          //   report.httpStatus = 400;
          //   report.message = "X should be single value and y should at least be one";
          //   init['error'] = report;
          //   let errorToHttp: HttpErrorResponse = new HttpErrorResponse(init);
          //   this.dialogsService.onError(errorToHttp)
          // }
          let xKey = ''
          let yKeys = {}
          this.datasetForChart.features.forEach((f:FeatureInfo)=>{
            // if(f.name ===  xFeat[0]){
            //   xKey = f.key
            // }
            // if(yFeat.includes( f.name) ){
              yKeys[f.name] = f.key
            // }

          })
          let xs = {}
          let xArr = []
          let ys = {}
          for ( let key in yKeys ){
            ys[key] = []
          }
          this.datasetForChart.dataEntry.forEach((de:DataEntry)=>{
            for (let key in de.values){
              if(key === String(xKey)){
                xArr.push(de.values[key])
              }
              for(let ykey in yKeys){
                if(yKeys[ykey] === key){
                  ys[ykey].push(de.values[key])
                }
              }
            }
            // xs[xFeat[0]] = xArr 
          })
          this.showData = this.getArray(ys)
          this.creatingPlotData = false
          this.createdPlotData = true;
          this.xPlot = xs
          this.yPlot = ys
        }
      })
    // })
  }

  private getArray(object) {
    return Object.keys(object).reduce(function (r, k) {
        object[k].forEach(function (a, i) {
            r[i] = r[i] || {};
            r[i][k] = a;
        });
        return r;
    }, []);
  }

  // getWholeDataset(datasetId, start, howMany): Promise<string>{
  //   this.datasetApi.getDataEntryPaginated(datasetId, start, howMany).subscribe((data:Dataset) =>{
  //     let totalRows = data.totalRows
  //     let nowGot = this.datasetForChart.dataEntry.length
  //     if(nowGot < totalRows){
  //       this.datasetApi.getDataEntryPaginated(datasetId, nowGot, howMany).subscribe((datanow:Dataset) =>{
  //         datanow.dataEntry.forEach(de =>{
  //           this.datasetForChart.dataEntry.push(de)
  //         })
  //         nowGot =  this.datasetForChart.dataEntry.length
  //         if(nowGot < totalRows){
  //           this.getWholeDataset(datasetId, nowGot, 30)
  //         }else{
  //           return new Promise<string>(resolve =>{
  //             return resolve('done')
  //           })
  //         }
  //       })
  //     }else{
  //       return new Promise<string>(resolve =>{
  //         return resolve('done')
  //       })
  //     }
  //   })
  //   return new Promise<string>(resolve =>{
  //     return resolve('done')
  //   })
  // }

  getWholeDataset(datasetId, start, howMany){
    this.datasetApi.getDataEntryPaginated(datasetId, start, howMany).subscribe((data:Dataset) =>{
      let totalRows = data.totalRows
      console.log(totalRows)
      let nowGot = this.datasetForChart.dataEntry.length
      if(nowGot < totalRows){
        this.datasetApi.getDataEntryPaginated(datasetId, nowGot, howMany).subscribe((datanow:Dataset) =>{
          datanow.dataEntry.forEach(de =>{
            this.datasetForChart.dataEntry.push(de)
          })
          nowGot =  this.datasetForChart.dataEntry.length
          if(nowGot < totalRows){
            this.getWholeDataset(datasetId, nowGot, 30)
          }else{
            this.datasetDownloaded.next(true)
          }
        })
      }else{
        this.datasetDownloaded.next(true)
      }
    })
  }

}

