import { Dataset } from './../model/dataset';
import { MetaInfo } from './../model/metaInfo';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';
import { map, filter, catchError, mergeMap, tap } from 'rxjs/operators';

import { ErrorReport } from '../model/errorReport';
import { Task } from './../model/task';
import { Config } from '../../config/config';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
 import { BaseClient } from './base.client';

@Injectable({
  providedIn: 'root'
})
export class DatasetService extends BaseClient<Dataset>{

  _privateBasePath:string;
  private dataset:Dataset;
  _datasetBase:string = "/dataset/"

  private _allDatasetsEndpoint:string;
  private _allFeaturedDatasetsEndpoint:string
  private _createDatasetEndpoint:string;
  private _createDatasetFromCsvEndpoint:string;
  private _createEmptyDatasetEndpoint:string;
  private _getFeaturedDatasetsEndpoint:string;
  private _mergeDatasetsEndpoint:string;
  private _deleteDatasetEndpoint:string;
  private _getDatasetByIdEndpoint:string;
  private _getDatasetFeaturesEndpoint:string;
  private _getDatasetMetaEndpoint:string;
  private _createQPRFEndpoint:string;

  constructor(http: HttpClient,
    public dialogsService:DialogsService,
    public oidcSecurityService: OidcSecurityService){
        super(http, dialogsService, oidcSecurityService, "/dataset/")
    }
    public uploadNewDatasetForPrediction(dataset:Dataset):Observable<Dataset>{
      dataset.existence = Dataset.ExistenceEnum.FORPREDICTION
      const token = this.oidcSecurityService.getToken();
      const tokenValue = 'Bearer ' + token;
      let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
      let pathFormed = Config.JaqpotBase + this._datasetBase
      return this.http.post(pathFormed, dataset, { headers: headers} ).pipe(
          tap((res : Response) => { 
              return res           
          }),catchError( err => this.dialogsService.onError(err) )
      );
}

public uploadNewDataset(dataset:Dataset):Observable<Dataset>{
  dataset.existence = Dataset.ExistenceEnum.UPLOADED
  const token = this.oidcSecurityService.getToken();
  const tokenValue = 'Bearer ' + token;
  let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
  let pathFormed = Config.JaqpotBase + this._datasetBase
  return this.http.post(pathFormed, dataset, { headers: headers} ).pipe(
      tap((res : Response) => { 
          return res           
      }),catchError( err => this.dialogsService.onError(err) )
  );
}

public putMeta(dataset:Dataset):Observable<MetaInfo>{
  const token = this.oidcSecurityService.getToken();
  const tokenValue = 'Bearer ' + token;
  let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
  let params = new HttpParams().set("query", "UNREAD");
  let pathFormed = Config.JaqpotBase + this._datasetBase + dataset._id + "/meta"
  return this.http.put(pathFormed, dataset, { headers: headers} ).pipe(
      tap((res : Response) => { 
          return res           
      }),catchError( err => this.dialogsService.onError(err) )
  );
}

public getDataEntryPaginated(datasetId:string, start:number, max:number){
  const token = this.oidcSecurityService.getToken();
  const tokenValue = 'Bearer ' + token;
  let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
  let params = new HttpParams().set('dataEntries', 'true').set('rowStart', start.toString()).set('rowMax', max.toString());
  let pathFormed = Config.JaqpotBase + this._datasetBase + datasetId
  return this.http.get(pathFormed, { headers: headers, params: params} ).pipe(
      tap((res : Response) => { 
          return res            
      }),catchError( err => this.dialogsService.onError(err) )
  );
}

public updateOnTrash(datasetId:string, dataset:Dataset):Observable<Dataset>{
  const token = this.oidcSecurityService.getToken();
  const tokenValue = 'Bearer ' + token;
  let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
  let pathFormed = Config.JaqpotBase + this._datasetBase + datasetId + '/ontrash';
  return this.http.put(pathFormed, dataset, { headers:headers }).pipe(
      tap((res : Response) =>{
          return res;
      }),catchError( err => this.dialogsService.onError(err) )
  )
}

}
