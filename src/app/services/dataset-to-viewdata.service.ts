import { Injectable } from '@angular/core';
import { Dataset } from './../jaqpot-client/model/dataset';
import { FeatureInfo } from './../jaqpot-client/model/featureInfo';
import { DataEntry } from './../jaqpot-client/model/dataEntry';
import { EntryId } from './../jaqpot-client/model/entryId';



@Injectable({
  providedIn: 'root'
})
export class DatasetToViewdataService {

  data:{ [key: string]: any; } = []

  constructor() { }

  public createViewData(dataset:Dataset, rows:number){
    let _data_entry:DataEntry[] = dataset.dataEntry
    let _featureInfo:FeatureInfo[] = dataset.features
    let uri_name_map:{ [key: string]: any; } = {}
    let keys = []
    _featureInfo.forEach(f =>{
      uri_name_map[f.key] = f.name
      keys.push(f.key)
    })
    let data_rows =[]
    _data_entry.forEach(de=>{
      let data_row:{ [key: string]: any; } = {}
      // let data_row:Map<string,any> = new Map()
      let entryid:EntryId = de.entryId
      data_row['Id'] = entryid.name
      let values:{ [key: string]: any; } = de.values
      keys.forEach(key =>{
        let feature_name =  uri_name_map[key]
        data_row[feature_name] = values[key]
        })
       data_rows.push(data_row) 
      })
      // console.log(data_rows)
    return data_rows
  }

}
