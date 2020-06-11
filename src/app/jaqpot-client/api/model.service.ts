import { Task } from './../model/task';
import { Model } from './../model/model';
import { MetaInfo } from './../model/metaInfo';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';
import { map, filter, catchError, mergeMap, tap } from 'rxjs/operators';
import { Dataset } from '../model/dataset';
import { Config } from '../../config/config';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Domain } from 'domain';



@Injectable({
  providedIn: 'root'
})
export class ModelApiService extends BaseClient<Dataset>{

  _privateBasePath:string;
  _modelBase:string = "/model/"

  constructor(http: HttpClient,
      public dialogsService:DialogsService,
      public oidcSecurityService: OidcSecurityService){
          super(http, dialogsService, oidcSecurityService, "/model/")
      }

  public putMeta(model:Model):Observable<MetaInfo>{
      const token = this.oidcSecurityService.getToken();
      const tokenValue = 'Bearer ' + token;
      let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
      let params = new HttpParams().set("query", "UNREAD");
      let pathFormed = Config.JaqpotBase + this._modelBase + model._id + "/meta"
      return this.http.put(pathFormed, model, { headers: headers} ).pipe(
          tap((res : Response) => { 
              return res           
          }),catchError( err => this.dialogsService.onError(err) )
      );
  }

  public predict(modelId:string, datasetUri:string, visible, doa:boolean):Observable<Task>{
      const token = this.oidcSecurityService.getToken();
      const tokenValue = 'Bearer ' + token;
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization', tokenValue);
      let pathFormed = Config.JaqpotBase + this._modelBase + modelId 
      let body = new HttpParams();
      body = body.set('dataset_uri', datasetUri);
      body = body.set('visible', visible);
      body = body.set('doa', doa.toString())
      return this.http.post(pathFormed, body.toString(), { headers:headers }).pipe(
          tap((res : Response) =>{
              return res;
          }),catchError( err => this.dialogsService.onError(err) )
      )
  }

  public updateOnTrash(modelId:string, model:Model):Observable<Model>{
      const token = this.oidcSecurityService.getToken();
      const tokenValue = 'Bearer ' + token;
      let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
      let pathFormed = Config.JaqpotBase + this._modelBase + modelId + '/ontrash';
      return this.http.put(pathFormed, model, { headers:headers }).pipe(
          tap((res : Response) =>{
              return res;
          }),catchError( err => this.dialogsService.onError(err) )
      )

  }

}