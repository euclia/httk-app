import { ErrorReport } from './../model/errorReport';
import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType} from '@angular/http';
import { HttpHeaders, HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthToken } from '../model/authToken';
import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
//import { error } from 'util';
import { Config } from '../../config/config';
// import { ErrorReport } from '../../ui-models/ErrorReport';
import { OidcSecurityService } from '../../../../node_modules/angular-auth-oidc-client';
import { tap, catchError, map } from '../../../../node_modules/rxjs/operators';
import { DialogsService } from '../../dialogs/dialogs.service';
import { Model } from '../model/model';


// @Injectable()
export abstract class BaseClient <T extends Model>{

    private _basePath : string;
    private _defaultHeaders: Headers = new Headers();
    private _path: string;

    constructor(protected http: HttpClient,
        protected dialogsService: DialogsService,
        protected oidcSecurityService: OidcSecurityService,
        protected requestPath:String) { 
        this._basePath = Config.JaqpotBase
        this._path = this._basePath + this.requestPath
    }

    public getWithIdSecured<T>(id:string): Observable<T>{
        let params = new HttpParams();
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        let pathFormed = this._path + id
        return this.http.get(pathFormed, { headers: headers, params: params } ).pipe(
            tap((res : Response) => { 
                return res           
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public getList<T>(params:HttpParams){
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        return this.http.get(this._path, {headers: headers, params:params}).pipe(
            tap((res:Response) => {
                return res.json
            }),catchError(err => this.dialogsService.onError(err))
        );
    }

    public getPropertyWithIdSecured<T>(id:string, property:string): Observable<T>{
        let params = new HttpParams();
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        let pathFormed = this._path + id + "/" + property
        return this.http.get(pathFormed, { headers: headers, params: params } ).pipe(
            tap((res : Response) => { 
                return res           
            }),catchError( err=> this.dialogsService.onError(err) )
        );
    }

    public putWithIdSecured<T>(id:string, updateIt:any): Observable<T>{
        let params = new HttpParams();
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        let pathFormed = this._path + id
        return this.http.put(pathFormed, updateIt, { headers: headers, params: params } ).pipe(
            tap((res : Response) => { 
                return res           
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public putEntitySecured<T>(updateIt:any): Observable<T>{
        let params = new HttpParams();
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        let pathFormed = this._path
        return this.http.put(pathFormed, updateIt, { headers: headers, params: params } ).pipe(
            tap((res : Response) => { 
                return res           
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public postEntity<T>(entity:any): Observable<T>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        let pathFormed = this._path
        return this.http.post(pathFormed, entity, { headers: headers} ).pipe(
            tap((res : Response) => { 
                return res          
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public deleteEntityWithID<T>(id:string): Observable<T>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        let pathFormed = this._path + id
        return this.http.delete(pathFormed, { headers: headers} ).pipe(
            tap((res : Response) => { 
                return res          
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public deleteEntity<T>(entity): Observable<T>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        let pathFormed = this._path
        const httpOptions = {
            headers: headers,
            body: { entity }
        };
        console.log(httpOptions)
        return this.http.delete(pathFormed, httpOptions ).pipe(
            tap((res : Response) => { 
                return res          
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public count<T>(params:HttpParams):Observable<any>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
        return this.http.get(this._path, { headers: headers, params: params, observe:'response' } ).pipe(
               tap(resp => { 
                    return resp.headers.get('total');            
                }),catchError( err => this.dialogsService.onError(err) )
         
        )}

}