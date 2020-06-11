import { Injectable } from '@angular/core';
import { FeatureInfo } from './../model/featureInfo';

@Injectable({
  providedIn: 'root'
})
export class FeatureInfoBuilderService {

  feature_info: FeatureInfo

  constructor() { 
    this.feature_info = <FeatureInfo>{}
  }

  public setName(name:string){
    this.feature_info.name = name
  }

  public setKey(key:string){
    this.feature_info.key = key;
  }

  public setUnits(units:string){
    this.feature_info.units = units
  }

  public setCategory(categ:FeatureInfo.CategoryEnum){
    this.feature_info.category = categ
  }

  public setUri(uri:string){
    this.feature_info.uri = uri
  }

  public setConditions(conditions:{ [key: string]: any; }){
    this.feature_info.conditions = conditions
  }

  public build(){
    return this.feature_info
  }

}
