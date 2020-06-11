import { Dataset } from './../jaqpot-client/model/dataset';
import { Task } from './../jaqpot-client/model/task';
import { Algorithm } from './../jaqpot-client/model/algorithm';
import { Parameter } from './../jaqpot-client/model/parameter';
import { ParameterstepsComponent } from './../base/components/parametersteps/parametersteps.component';
import { ParameterlistComponent } from './../base/components/parameterlist/parameterlist.component';
import { AlgorithmService } from './../jaqpot-client/api/algorithm.service';
import { MaterialModule } from './../material/material.module';
import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, throwError, Subject } from 'rxjs';
import { startWith, map, delay } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TaskApiService } from './../jaqpot-client/api/task.service';
import { HttkApiService } from './../jaqpot-client/api/httk.service';
import { DatasetService } from './../jaqpot-client/api/dataset.service';

@Component({
  selector: 'app-createhttkmodel',
  templateUrl: './createhttkmodel.component.html',
  styleUrls: ['./createhttkmodel.component.scss']
})
export class CreatehttkmodelComponent implements OnInit {

  chemControl = new FormControl();
  species: string;

  viewError:boolean = false;
  public algo: Algorithm;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;

  actualPredicted:Dataset;

  taskGot:Task
  predTask:Task
  taskCompletedSuccesfully:boolean = false;
  predictionCompletedSuccesfully:boolean = false;
  progressValue:number = 0
  taskHasError:boolean = false;
  observe: Subject<Task> = new Subject();
  observePrediction: Subject<Task> = new Subject();

  predictedDataset:string = ''
  predictedModel:string = ''
  
  public parameters: Array<Parameter>;
  parametersFormGroup: FormGroup;
  speciesFormGroup: FormGroup;
  chemoptions: Observable<string[]>;
  chemOptionsAll:string[] = ['press key to load options'];
  chemname:string

  
  trainingTask:boolean =false;

  viewPrediction:boolean = false;

  @ViewChild(ParameterlistComponent) parametersList;
  @ViewChild(ParameterstepsComponent) parameterSteps;

  
  constructor(
    private algoService:AlgorithmService,
    private _formBuilder: FormBuilder,
    private _http:HttpClient,
    private _httkApi:HttkApiService,
    private _taskApi:TaskApiService,
    private _datasetApi:DatasetService,

  ) { }

  ngOnInit(): void {
    this.parametersFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    })
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
        this.secondFormGroup = this._formBuilder.group({
      secCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: ['', Validators.required]
    });
    this.algoService.getAlgorithmById('httk')
    .subscribe(algoGot=>{
      this.algo = algoGot;
      // console.log(algoGot._id);
      this.parameters = algoGot.parameters
      // this.parameters = this.parametersList.parameters
    })
    
    this.chemoptions =this.chemControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
    );
    this.observe.subscribe((task:Task) =>{
      this.getTrainingTask(task._id)      
    })
    this.observePrediction.subscribe((task:Task) =>{
      this.getPredictionTask(task._id)      
    })
  }

  submitedSpecies(){
    if(typeof this.species != 'undefined'){
      if(this.species === 'Human'){
        this._http.get(location.origin + '/assets/humanhttk.json').subscribe(res => {
          let resp = JSON.parse(res.toString())
          let chemoptionsgot = <string[]> resp.allowed
          this.chemOptionsAll = []
          chemoptionsgot.forEach(s =>{this.chemOptionsAll.push(s)})
        }) 
      }
      if(this.species === 'Rat'){
        this._http.get(location.origin + '/assets/rathttk.json').subscribe(res => {
          let resp = JSON.parse(res.toString())
          let chemoptionsgot = <string[]> resp.allowed
          this.chemOptionsAll = []
          chemoptionsgot.forEach(s =>{this.chemOptionsAll.push(s)})
        }) 
      }
    }
  }
  create(){
    let species = this.firstFormGroup.get('firstCtrl').value
    let chemName = this.chemname
    // let dose = Number(this.thirdFormGroup.get('thirdCtrl').value)
    // let days = Number(this.secondFormGroup.get('secCtrl').value)
    let dose = Number(this.secondFormGroup.get('secCtrl').value)
    let days = Number(this.thirdFormGroup.get('thirdCtrl').value)
    let title = this.fourthFormGroup.get('fourthCtrl').value
    let description = this.fifthFormGroup.get('fifthCtrl').value
   // console.log(species,chemName,dose,days,title,description);
    let parameters = new Map()
    parameters['dose'] = [dose]
    parameters['days'] = [days]
    parameters['chem.name'] = [chemName]
    parameters['species'] = [species]
    this.taskHasError = false;
    this.taskGot = null
    this.predTask = null
    let parametersString = JSON.stringify(parameters)
    this._httkApi.createHttkModel( parametersString, title, description).subscribe((resp:Task)=>{
      if(typeof resp != 'undefined'){
        this.progressValue = 5  
        this.getTrainingTask(resp._id)
          // this.observe.subscribe((task:Task) =>{
          //   this.getTrainingTask(task._id)      
          // })   
      }
    })

  }
  getTrainingTask(taskId){
    if(this.observe.isStopped){
      this.observe = new Subject();
      this.observe.subscribe((task:Task) =>{
        this.getTrainingTask(task._id)      
      })
    }
    this._taskApi.getTask(taskId)
          .pipe(delay(800)).subscribe((taskGot:Task) => {
            this.taskGot = taskGot
            if(typeof taskGot != 'undefined'){
              if(taskGot.status.toString() === 'QUEUED' || taskGot.status.toString() === 'RUNNING' && taskGot.percentageCompleted < 100){
                if(typeof taskGot.percentageCompleted != 'undefined'){
                  this.progressValue = (taskGot.percentageCompleted + 5)/2
                }
                this.observe.next(taskGot);
              }else{
                if(typeof taskGot.percentageCompleted != 'undefined'){
                  this.progressValue = (taskGot.percentageCompleted + 5)/2
                  if(taskGot.percentageCompleted === 100){
                    this.predictedModel= taskGot.result;
                    this._httkApi.predictFromModel(this.predictedModel.split("/")[1]).subscribe(
                      (resp:Task)=>{
                        if(typeof resp != 'undefined'){
                          this.progressValue += 5  
                          this.getPredictionTask(resp._id)
                        }
                      }
                    )
                  }
                }
                this.taskCompletedSuccesfully = true;
                this.taskGot = taskGot
                this.observe.unsubscribe();
              }
            }
            
          },error => this.handleTaskError(error, taskId))
  }
  getPredictionTask(taskId){
    if(this.observePrediction.isStopped){
      this.observePrediction = new Subject();
      this.observePrediction.subscribe((task:Task) =>{
        this.getPredictionTask(task._id)      
      })
    }
    this._taskApi.getTask(taskId)
          .pipe(delay(800)).subscribe((taskGot:Task) => {
            this.predTask = taskGot
            if(typeof taskGot != 'undefined'){
              if(taskGot.status.toString() === 'QUEUED' || taskGot.status.toString() === 'RUNNING' && taskGot.percentageCompleted < 100){
                if(typeof taskGot.percentageCompleted != 'undefined'){
                  this.progressValue = (taskGot.percentageCompleted + 50)/2 
                }
                this.observePrediction.next(taskGot);
              }else{
                if(typeof taskGot.percentageCompleted != 'undefined'){
                  this.progressValue = (taskGot.percentageCompleted + 50)/2 
                  if(taskGot.percentageCompleted === 100){
                    this.predictionCompletedSuccesfully = true;
                    this.predictedDataset = taskGot.result;
                  }
                }
                this.progressValue = 100
                this.predictionCompletedSuccesfully = true;
                this.predTask = taskGot
                this.observePrediction.unsubscribe();
              }
            }
            
          },error => this.handleTaskError(error, taskId))
  }
  private handleTaskError(error: HttpErrorResponse, taskId) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      this.observe.unsubscribe()
      this.taskGot = error.error;
      this.taskHasError = true;
      if(typeof this.taskGot.percentageCompleted != 'undefined'){
        this.progressValue = this.taskGot.percentageCompleted + 5
      }
      console.error(error.error);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  viewTheResult(){
    this.viewPrediction = true;
    this._datasetApi.getDataEntryPaginated(this.predictedDataset.split("/")[1], 0 ,40).subscribe((dataset:Dataset)=>{
      this.actualPredicted = dataset
    })

  }

  viewTheError(){
    this.viewError = true
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.chemOptionsAll.filter(option => option.toLowerCase().includes(filterValue));
  }
}
