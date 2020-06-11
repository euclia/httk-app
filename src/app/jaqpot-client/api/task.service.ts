import { Model } from './../model/model';
import { Task } from './../model/task';
import { MetaInfo } from './../model/metaInfo';
import {throwError as observableThrowError,  Observable, interval } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';
import { map, filter, catchError, mergeMap, tap, retryWhen } from 'rxjs/operators';
import { Config } from '../../config/config';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Dataset } from './../model/dataset';
import { BaseClient } from './base.client';


@Injectable({
  providedIn: 'root'
})
export class TaskApiService extends BaseClient<Task>{
  _privateBasePath:string;
  private dataset:Dataset;
  _modelBase:string = "/task/"
  
  constructor(http: HttpClient,
    public dialogsService:DialogsService,
    public oidcSecurityService: OidcSecurityService) {
      super(http, dialogsService, oidcSecurityService, "/task/")
     }
     public getTask(taskId:string):Observable<Task>{
      const token = this.oidcSecurityService.getToken();
      const tokenValue = 'Bearer ' + token;
      let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
      let pathFormed = Config.JaqpotBase + this._modelBase + taskId
      return this.http.get(pathFormed, {headers:headers})
      
  }
}
