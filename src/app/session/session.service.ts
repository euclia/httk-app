import {Injectable} from '@angular/core';
import {Observable, Subject,  BehaviorSubject } from 'rxjs';
import {Http} from '@angular/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { Algorithm } from '../jaqpot-client/model/algorithm';
import { Dataset } from '../jaqpot-client/model/dataset';

@Injectable()
export class SessionService{

    private subjectId = new Subject<any>();
    token: string;
    userid:string;
    private accessToken: Subject<string> = new BehaviorSubject(this.token);
    private userName = new Subject<any>();
    //private loggedIn = new Subject<any>();
    private theme = new Subject<any>();
    algo:Algorithm
    algorithm$: Subject<Algorithm> = new BehaviorSubject(this.algo);
    modelingAlgorithm:Algorithm
    modelingAlgorithm$: Subject<Algorithm> = new BehaviorSubject(this.modelingAlgorithm);
    private dataset: Dataset;
    
    private modelingDataset = new Subject<Dataset>();
    private datasetForDisplay = new Subject<Dataset>();

    constructor(){

    }

    getSubjectId(): Observable<any>{
        return this.subjectId.asObservable();
    }

   // getLoggedIn(): Observable<any>{
    //    return this.loggedIn.asObservable();
  //  }

    getUserId(){
        var userData = JSON.parse(localStorage.getItem('userData'))
        this.userid = userData.sub
        return this.userid;
    }

    getUserData(){
        var userData = JSON.parse(localStorage.getItem('userData'))
        return userData
    }

    getUserName(): Observable<any>{
        return this.userName.asObservable();
    }

    getTheme(): Observable<any>{
        return this.theme.asObservable();
    }

    getAlgorithm(): Observable<Algorithm>{
        return this.algorithm$.asObservable();
    }

    clearAlgorithm(){
        this.algorithm$.next();
    }

    setAlgorithm(algorithm:Algorithm){
        this.algorithm$.next( algorithm )
    }

    getDataset(){
        return this.dataset;
    }

    clearDataset(){
        this.dataset = null;
    }

    setDataset(dataset:Dataset){
        this.dataset = dataset 
    }

    clearModelingAlgorithm(){
        this.modelingAlgorithm$.next();
    }

    setModelingAlgorithm(algorithm:Algorithm){
        this.modelingAlgorithm$.next( algorithm )
    }

    getModelingAlgorithm(){
        return this.modelingAlgorithm$.asObservable();
    }

    clearModelingDataset(){
        this.modelingDataset.next();
    }

    setModelingDataset(dataset:Dataset){
        this.modelingDataset.next( dataset )
    }

    getModelingDataset(){
        return this.modelingDataset.asObservable();
    }

    setAccessToken(key:string, value:any){
        localStorage.setItem(key, value)
    }

    // getAccessToken(){
    //     return this.accessToken.asObservable();
    // }

    get(key: any){
        return localStorage.getItem(key);
    }

    remove(key:any){
        switch(key){
            case 'subjectId':{
                this.subjectId.next();
                break;
            }
            //case 'loggedIn':{
           //     var fal = "false";
           //     this.loggedIn.next({ fal });
          //      break;
         //   }
            case 'userName':{
                this.userName.next();
                break;
            }

        }
        return localStorage.removeItem(key);
    }

    clear(){
        var nul = "null";
        this.subjectId.next({ nul });
     //   this.loggedIn.next({ nul });
        this.userName.next({ nul });
        return localStorage.clear();
    }

    clearUsername(){
        this.userName.next();
        return localStorage.clear();
    }

    clearSubject(){
        var nul = "null";
        this.subjectId.next({ nul });
    }

    set(key:any, data:any){
        switch(key){
            case 'subjectId':{
                this.subjectId.next({ data });
                break;
            }
            case 'userName':{
                this.userName.next({ data });
                break;
            }
            case 'theme':{
                this.theme.next({ data });
                break;
            }
        }
        return localStorage.setItem(key, data);
    }


}
