import { Injectable } from '@angular/core';
import { Config } from '../../config/config';
import { Dataset } from './../model/dataset';
import { MetaInfo } from './../model/metaInfo';
import { FeatureInfo } from './../model/featureInfo';
import { Feature } from './../model/feature';
import { DataEntry } from './../model/dataEntry';


@Injectable({
  providedIn: 'root'
})
export class DatasetBuilderService {

  public dataset:Dataset

  constructor(
  ) {
    this.dataset = <Dataset>{}
    this.dataset.features = []
    this.dataset.dataEntry = []
  }

  public setMeta(metaInfo:MetaInfo){
    this.dataset.meta = metaInfo
  }

  public setFeatureInfoFromFeatures(_features:Feature[]){
    let _feat_infos = []
    _features.forEach(f =>{
      let _feat_info = <FeatureInfo>{}
      if(f.id != null){
        _feat_info.uri = Config.JaqpotBase + "/feature/" + f.id
      }
      if(f.units != null){
        _feat_info.units = f.units
      }
      _feat_info.name = f.meta.titles[0]
      _feat_infos.push(_feat_info)
    })
    this.dataset.features = _feat_infos
  }

  public appendfeatureInfo(featInfo:FeatureInfo){
    this.dataset.features.push(featInfo)
  }

  public setTotalRows(rows:number){
    this.dataset.totalRows = rows
  }

  public setTotalCols(cols:number){
    this.dataset.totalColumns = cols
  }

  public setExistenceUploaded(existence:Dataset.ExistenceEnum){
    this.dataset.existence = existence
  }

  public appendDataEntry(dataEntry:DataEntry){
    this.dataset.dataEntry.push(dataEntry)
  }

  public build(){
    return this.dataset
  }

}
