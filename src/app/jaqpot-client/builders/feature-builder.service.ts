import { Injectable } from '@angular/core';
import { Feature } from './../model/feature';
import { MetaInfo } from './../model/metaInfo';

@Injectable({
  providedIn: 'root'
})
export class FeatureBuilderService {

  public feature:Feature

  constructor() { 
    this.feature= <Feature>{}
  }

  public setMeta(meta:MetaInfo){
    this.feature.meta = meta
  }

  public setFeatured(featured:boolean){
    this.feature.featured = featured
  }

  public setOntClasses(ontClasses:string){
    let _ontClasses = []
    _ontClasses.push(ontClasses)
    this.feature.ontologicalClasses = _ontClasses
  }

  public setUnits(_units:string)
  {
    this.feature.units = _units
  }

  public setVisible(_visible:boolean){
    this.feature.visible = _visible
  }

  public setAdmissableValues(_admVal:string){
    let _admVals = []
    _admVals.push(_admVal)
    this.feature.admissibleValues = _admVals
  }

  public build(){
    return this.feature
  }
}
