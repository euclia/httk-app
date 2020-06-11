import { DataEntry } from './../model/dataEntry';
import { MetaInfo } from './../model/metaInfo';
import { FeatureInfo } from './../model/featureInfo';
import { Dataset } from './../model/dataset';
import { Feature } from './../model/feature';
import { Injectable } from '@angular/core';
import { Config } from '../../config/config';
import { ConnectedPositionStrategy } from '@angular/cdk/overlay';
import { FeatureAndValue } from '../../ui-models/featureAndValue';
import { DatasetBuilderService } from '../builders/dataset-builder.service';
import { FeatureBuilderService } from '../builders/feature-builder.service';
import { MetaBuilderService } from '../builders/meta-builder.service';
import { FeatureInfoBuilderService } from '../builders/feature-info-builder.service';
import { DataEntryBuilderService } from '../builders/data-entry-builder.service';
import { SessionService } from '../../session/session.service';



@Injectable({
  providedIn: 'root'
})
export class DatasetFactoryService {

  constructor(
    public sessionService:SessionService
  ) { }

  createDummyFromCsv(csv:string, id:string){
    let _datasetBuilder = new DatasetBuilderService();
    let _metaBuilder = new MetaBuilderService();
    const rows = csv.split(/\r?\n/)
    rows.forEach(r => {
      let data = r.split(/,|;/)
      if(data.length === 1){
        let remove = rows.indexOf(r)
        rows.splice(remove, 1)
      }
    })
    let ids = rows[0].split(/,|;/);
    let id_index:number;
    if(id != "None"){
      id_index = ids.indexOf(id, 0);
      if (id_index > -1) {
        ids.splice(id_index, 1);
     }
    }
    rows.splice(0,1)
    let userid = this.sessionService.getUserId();
    _metaBuilder.setCreators(userid)
    _metaBuilder.initializeAudiences()
    _metaBuilder.initializeComments()
    _metaBuilder.initializeDescriptions()
    _metaBuilder.initializeTags()
    _metaBuilder.initilizeTitles()
    _metaBuilder.initializeSubjects()
    let meta = _metaBuilder.build()
    _datasetBuilder.setMeta(meta)
    let featureInfos = []
    let k = 0;
    ids.forEach(id =>{
      let _featureInfoBuilder = new FeatureInfoBuilderService();
      _featureInfoBuilder.setKey(k.toString())
      _featureInfoBuilder.setName(id)
      _featureInfoBuilder.setUri('temporary/'+id)
      let featInfo = _featureInfoBuilder.build()
      _datasetBuilder.appendfeatureInfo(featInfo)
      featureInfos.push(featInfo)
      k += 1;
    })
    let i = 1
    rows.forEach(r =>{
      // let data_to_enter = r.split(/,|;/)
      let data_to_enter = this.csvToArray(r)
      if(id_index > -1 ){
        let _dataEntryBuilder = new DataEntryBuilderService()
        _dataEntryBuilder.setEntryIdName(data_to_enter[id_index].toString())
        _dataEntryBuilder.setOwnerUUID(this.sessionService.getUserId())
        data_to_enter.splice(id_index, 1)
        let values : { [key: string]: any} = {};
        for(var _i = 0; _i < data_to_enter.length; _i++){
          let featInfo:FeatureInfo = featureInfos[_i]
          if(isNaN( Number(data_to_enter[_i]))){
            values[ featInfo.key.toString() ] = data_to_enter[_i]
          }else{
            values[ featInfo.key.toString() ] = Number(data_to_enter[_i])
          }
        }
        _dataEntryBuilder.setDataEntry(values)
        let _dataEntry = _dataEntryBuilder.build()
        _datasetBuilder.appendDataEntry(_dataEntry)
      }
      else{
        let _dataEntryBuilder = new DataEntryBuilderService()
        _dataEntryBuilder.setEntryIdName(i.toString())
        _dataEntryBuilder.setOwnerUUID(this.sessionService.getUserId())
        let values : { [key: string]: any} = {};
        for(var _i = 0; _i < data_to_enter.length; _i++){
          let featInfo:FeatureInfo = featureInfos[_i]
          if(isNaN( Number(data_to_enter[_i]))){
            values[ featInfo.key.toString() ] = data_to_enter[_i]
          }else{
            values[ featInfo.key.toString() ] = Number(data_to_enter[_i])
          }
        }
        _dataEntryBuilder.setDataEntry(values)
        let _dataEntry = _dataEntryBuilder.build()
        _datasetBuilder.appendDataEntry(_dataEntry)
      }
      i += 1
    })
    
    let dataset = _datasetBuilder.build()

    return dataset
  }

  createDummyFromImageCsv(csv:string, id:string){
    let _datasetBuilder = new DatasetBuilderService();
    let _metaBuilder = new MetaBuilderService();
    const rows = csv.split(/\r?\n/)
    rows.forEach(r => {
      let data = r.split(/,|;/)
      if(data.length === 1){
        let remove = rows.indexOf(r)
        rows.splice(remove, 1)
      }
    })
    let ids = rows[0].split(/,|;/);
    let id_index:number;
    if(id != "None"){
      id_index = ids.indexOf(id, 0);
      if (id_index > -1) {
        ids.splice(id_index, 1);
     }
    }
    rows.splice(0,1)
    let userid = this.sessionService.getUserId();
    _metaBuilder.setCreators(userid)
    _metaBuilder.initializeAudiences()
    _metaBuilder.initializeComments()
    _metaBuilder.initializeDescriptions()
    _metaBuilder.initializeTags()
    _metaBuilder.initilizeTitles()
    _metaBuilder.initializeSubjects()
    let meta = _metaBuilder.build()
    _datasetBuilder.setMeta(meta)
    let featureInfos = []
    let k = 0;
    ids.forEach(id =>{
      let _featureInfoBuilder = new FeatureInfoBuilderService();
      _featureInfoBuilder.setName(id)
      _featureInfoBuilder.setKey(k.toString())
      _featureInfoBuilder.setUri('temporary/'+id)
      let featInfo = _featureInfoBuilder.build()
      _datasetBuilder.appendfeatureInfo(featInfo)
      featureInfos.push(featInfo)
      k += 1;
    })
    let i = 1
    rows.forEach(r =>{
      let data_to_enter_temp = r.split(/,|;/)
      let data_to_enter = []
      data_to_enter[0] = data_to_enter_temp[0]
      data_to_enter[1] = data_to_enter_temp[1] + ";" + data_to_enter_temp[2] + "," + data_to_enter_temp[3]
      if(id_index > -1 ){
        let _dataEntryBuilder = new DataEntryBuilderService()
        _dataEntryBuilder.setEntryIdName(data_to_enter[id_index].toString())
        _dataEntryBuilder.setOwnerUUID(this.sessionService.getUserId())
        data_to_enter.splice(id_index, 1)
        let values : { [key: string]: any} = {};
        for(var _i = 0; _i < data_to_enter.length; _i++){
          let featInfo:FeatureInfo = featureInfos[_i]
          if(isNaN( Number(data_to_enter[_i]))){
            values[ featInfo.key.toString() ] = data_to_enter[_i]
          }else{
            values[ featInfo.key.toString() ] = Number(data_to_enter[_i])
          }
        }
        _dataEntryBuilder.setDataEntry(values)
        let _dataEntry = _dataEntryBuilder.build()
        _datasetBuilder.appendDataEntry(_dataEntry)
      }
      else{
        let _dataEntryBuilder = new DataEntryBuilderService()
        _dataEntryBuilder.setEntryIdName(i.toString())
        _dataEntryBuilder.setOwnerUUID(this.sessionService.getUserId())
        let values : { [key: string]: any} = {};
        for(var _i = 0; _i < data_to_enter.length; _i++){
          let featInfo:FeatureInfo = featureInfos[_i]
          values[ featInfo.key.toString() ] = data_to_enter[_i]
        }
        _dataEntryBuilder.setDataEntry(values)
        let _dataEntry = _dataEntryBuilder.build()
        _datasetBuilder.appendDataEntry(_dataEntry)
      }
      i += 1
    })
    
    let dataset = _datasetBuilder.build()
    return dataset
  }


  public createPredictDataset(features:FeatureAndValue[]){
    let dataset:Dataset = <Dataset>{}
    let meta:MetaInfo = <MetaInfo>{}
    meta.creators = []
    meta.creators.push(this.sessionService.getUserId())
    meta.titles = []
    meta.titles.push("Created for prediction")
    dataset.meta = meta;
    dataset.dataEntry = []
    let i = 0
    let dataEntry:DataEntry = <DataEntry>{};
    let _dataEntryBuilder = new DataEntryBuilderService();
    let values:{ [key: string]: any} = {};
    let k = 0;
    dataset.features = []
    features.forEach((feat:FeatureAndValue)=>{
      if(isNaN( Number(feat.value)) && feat.value.substr(0,1) != "["){
        values[k.toString()] = feat.value
      }
      else if(feat.value.substr(0,1) === "["){
        let arVal = []
        let subStrVal = feat.value.substr(1, feat.value.length - 2)
        subStrVal.split(",").forEach(v=>{
          if(isNaN( Number(v))){
            arVal.push(v.substr(1, v.length - 2))
          }else{
            arVal.push(Number(v))
          }
        })
        values[k.toString()] = arVal
      }
      else{
        values[k.toString()] = Number(feat.value)
      }
      let featureInfo:FeatureInfo = <FeatureInfo>{}
      featureInfo.uri = Config.JaqpotBase + "/feature/" + feat.feature._id
      featureInfo.name = feat.feature.meta.titles[0]
      featureInfo.key = k.toString()
      dataset.features.push(featureInfo)
      k += 1;
    })

    _dataEntryBuilder.setEntryIdName(i.toString())
    _dataEntryBuilder.setDataEntry(values)
    dataEntry =  _dataEntryBuilder.build()
    dataset.dataEntry.push(dataEntry)
    dataset.existence = Dataset.ExistenceEnum.FORPREDICTION
    
    return dataset;
  }

  public matchPredictDataset(features:FeatureAndValue[], csv, id){
    let dataset:Dataset = <Dataset>{}
    let meta:MetaInfo = <MetaInfo>{}
    meta.creators = []
    meta.creators.push(this.sessionService.getUserId())
    meta.titles = []
    meta.titles.push("Created for prediction")
    dataset.meta = meta;
    dataset.dataEntry = []
    const rows:string[] = csv.split(/\r?\n/)  
    let ids = []
    rows[0].split(/,|;/).forEach(id => {
      let cleanedid = id.replace(/^"|"$/g, '')
      ids.push(cleanedid)
    });
    rows.splice(0,1)
    let i = 0
    rows.forEach(row => {
      let data:string[] = this.csvToArray(row)
      if(data.length > 0){
        let dataEntry:DataEntry = <DataEntry>{};
        let _dataEntryBuilder = new DataEntryBuilderService();
        let values:{ [key: string]: any} = {};
        if(id === 'None'){
          _dataEntryBuilder.setEntryIdName(i.toString())
        }else{
          let idIndex = ids.indexOf(id)
          _dataEntryBuilder.setEntryIdName(data[idIndex])
        }
        let k = 0
        features.forEach((feat:FeatureAndValue) =>{
          let valueIndex = ids.indexOf(feat.feature.meta.titles[0])
          if(isNaN( Number(data[valueIndex])) ){
            values[k.toString()] = data[valueIndex]
          }
          // else if(data[valueIndex].substr(0,1).match(/\p{L}/g)){
          //   let arVal = []
          //   let subStrVal = data[valueIndex].substr(1, data[valueIndex].length - 2)
          //   subStrVal.split(",").forEach(v=>{
          //     if(isNaN( Number(v))){
          //       arVal.push(v)
          //     }else{
          //       arVal.push(Number(v))
          //     }
          //   })
          //   values[k.toString()] = arVal
          // }
          else{
            values[k.toString()] = Number(data[valueIndex])
          }
          _dataEntryBuilder.setDataEntry(values)
          k += 1;
        })
        dataEntry =  _dataEntryBuilder.build()
        dataset.dataEntry.push(dataEntry)
        i = i + 1
      }
    })
    dataset.existence = Dataset.ExistenceEnum.FORPREDICTION
    dataset.features = []
    let k2 = 0
    features.forEach((feat:FeatureAndValue)=>{
      let featureInfo:FeatureInfo = <FeatureInfo>{}
      featureInfo.uri = Config.JaqpotBase + "/feature/" + feat.feature._id
      featureInfo.key = k2.toString()
      featureInfo.name = feat.feature.meta.titles[0]
      dataset.features.push(featureInfo)
      k2 += 1;
    })
    // console.log(dataset)
    return dataset;
  }

  public matchValidateDataset(indepFeatures:FeatureAndValue[],depFeatures:FeatureAndValue[], csv, id){
    let dataset:Dataset = <Dataset>{}
    let meta:MetaInfo = <MetaInfo>{}
    meta.creators = []
    meta.creators.push(this.sessionService.getUserId())
    meta.titles = []
    meta.titles.push("Created for validation")
    dataset.meta = meta;
    dataset.dataEntry = []
    const rows:string[] = csv.split(/\r?\n/)  
    let ids = []
    rows[0].split(/,|;/).forEach(id => {
      let cleanedid = id.replace(/^"|"$/g, '')
      ids.push(cleanedid)
    });
    rows.splice(0,1)
    let i = 0
    rows.forEach(row => {
      let data:string[] = this.csvToArray(row)
      if(data.length > 0){
        let dataEntry:DataEntry = <DataEntry>{};
        let _dataEntryBuilder = new DataEntryBuilderService();
        let values:{ [key: string]: any} = {};
        if(id === 'None'){
          _dataEntryBuilder.setEntryIdName(i.toString())
        }else{
          let idIndex = ids.indexOf(id)
          _dataEntryBuilder.setEntryIdName(data[idIndex])
        }
        let k = 0;
        indepFeatures.forEach((feat:FeatureAndValue) =>{
          let valueIndex = ids.indexOf(feat.feature.meta.titles[0])
          if(isNaN( Number(data[valueIndex]))){
            values[k.toString()] = data[valueIndex]
          }
          // else if(data[valueIndex].substr(0,1) === "["){
          //   let arVal = []
          //   let subStrVal = data[valueIndex].substr(1, data[valueIndex].length - 2)
          //   subStrVal.split(",").forEach(v=>{
          //     if(isNaN( Number(v))){
          //       arVal.push(v)
          //     }else{
          //       arVal.push(Number(v))
          //     }
          //   })
          //   values[k.toString()] = arVal
          // }
          else{
            values[k.toString()] = Number(data[valueIndex])
          }
          _dataEntryBuilder.setDataEntry(values)
          k += 1;
        })
        depFeatures.forEach((feat:FeatureAndValue) =>{
          let valueIndex = ids.indexOf(feat.feature.meta.titles[0])
          if(isNaN( Number(data[valueIndex])) ){
            values[k.toString()] = feat.value
          }
          // if(data[valueIndex].substr(0,1) === "["){
          //   let arVal = []
          //   let subStrVal = data[valueIndex].substr(1, data[valueIndex].length - 2)
          //   subStrVal.split(",").forEach(v=>{
          //     if(isNaN( Number(v))){
          //       arVal.push(v)
          //     }else{
          //       arVal.push(Number(v))
          //     }
          //   })
          //   values[k.toString()] = arVal
          // }
          else{
            values[k.toString()] = Number(data[valueIndex])
          }
          _dataEntryBuilder.setDataEntry(values)
          k += 1;
        })
        dataEntry =  _dataEntryBuilder.build()
        dataset.dataEntry.push(dataEntry)
        i = i + 1
      }
    })
    dataset.existence = Dataset.ExistenceEnum.FORPREDICTION
    dataset.features = []
    let k2 = 0;
    indepFeatures.forEach((feat:FeatureAndValue)=>{
      let featureInfo:FeatureInfo = <FeatureInfo>{}
      featureInfo.uri = Config.JaqpotBase + "/feature/" + feat.feature._id
      featureInfo.name = feat.feature.meta.titles[0]
      featureInfo.key = k2.toString()
      dataset.features.push(featureInfo)
      k2 += 1;
    })
    depFeatures.forEach((feat:FeatureAndValue)=>{
      let featureInfo:FeatureInfo = <FeatureInfo>{}
      featureInfo.uri = Config.JaqpotBase + "/feature/" + feat.feature._id
      featureInfo.name = feat.feature.meta.titles[0]
      featureInfo.key = k2.toString()
      dataset.features.push(featureInfo)
      k2 += 1;
    })
    return dataset;
  }

  csvToArray(text:string){
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
  }

  createEmty(){

  }
}
