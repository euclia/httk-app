import { Algorithm } from './../model/algorithm';
import { DialogsService } from './../../dialogs/dialogs.service';
import { ErrorReport } from './../model/errorReport';
import { Inject,Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient, HttpResponse } from '@angular/common/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Config } from '../../config/config';
import { Observable } from 'rxjs';
import { map, filter, catchError, mergeMap, tap } from 'rxjs/operators';
import { Response, ResponseContentType } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {

  
  private _basePath : string;
  private _defaultHeaders: Headers = new Headers();

  private _getAlgorithmsEndpoint : string;
  private _postAlgorithmEndpoint : string;
  private _getAlgorithmById : string;
  private _deleteAlgorithmEndpoint : string;
  private _getAlgorithmByIdEndpoint : string;
  private _modifyAlgorithmEndpoint: string;
  private _createModelEndpoint:string
  private _errorReportEndpoint: ErrorReport;
  private _subjectId:string;

  constructor(private http: HttpClient,
    private dialogsService:DialogsService,
    public oidcSecurityService: OidcSecurityService
    ) {

      this._basePath = Config.JaqpotBase;

      this._getAlgorithmsEndpoint = this._basePath + "/algorithm";
      this._getAlgorithmById = this._basePath + "/algorithm/";
      this._postAlgorithmEndpoint = this._basePath + "/algorithm";
      this._deleteAlgorithmEndpoint = this._basePath + "/algorithm";
      this._getAlgorithmByIdEndpoint = this._basePath + "/algotithm";
      this._modifyAlgorithmEndpoint = this._basePath + "/algorithm";
      this._createModelEndpoint = this._basePath + "/algorithm";

     }
     public getAlgorithms( _class?: string, start?: number, max?: number): Observable<Array<Algorithm>> {
      let params = new HttpParams();
      params.set('class', _class);
      params.set('start', start.toString());
      params.set('max', max.toString());
      let headers = new HttpHeaders({'Content-Type':'application/json'});
      headers.set('subjectid', this._subjectId);
      const token = this.oidcSecurityService.getToken();
      const tokenValue = 'Bearer ' + token;
      headers.set('Authorization', tokenValue);
      return this.http.get(this._getAlgorithmsEndpoint, { headers: headers, params: params }).pipe(
          tap((res : Response) => {
              return res.json();
       }),catchError( this.dialogsService.onError ));
  
  }

  public getAlgorithmsCount( _class?: string, start?: number, max?: number): Observable<Response> {
      let params = new HttpParams();
      params.set('class', _class);
      params.set('start', "0");
      params.set('max', "1");
      
      let headers = new HttpHeaders({'Content-Type':'application/json'});
      const token = this.oidcSecurityService.getToken();
      const tokenValue = 'Bearer ' + token;
      headers.set('Authorization', tokenValue);

      return this.http.get(this._getAlgorithmsEndpoint, { headers: headers, params: params }).pipe(
          map((res : Response) => {
              var total = res.headers.get('total');   
              return res;             
          }),catchError( this.dialogsService.onError ));
  }

  public getAlgorithmById(id:string): Observable<Algorithm> {
      let params = new HttpParams();
      const token = this.oidcSecurityService.getToken();
      const tokenValue = 'Bearer ' + token;
      let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
      return this.http.get(this._getAlgorithmById + id, { headers: headers, params: params }).pipe(
          tap((res : Response) => {  
              return res;             
          }),catchError( err => this.dialogsService.onError(err) ));
  }
}
