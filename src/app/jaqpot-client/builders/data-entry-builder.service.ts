import { EntryId } from './../model/entryId';
import { Injectable } from '@angular/core';
import { DataEntry } from './../model/dataEntry';

@Injectable({
  providedIn: 'root'
})
export class DataEntryBuilderService {

  dataEntry:DataEntry
  entryId:EntryId
  constructor() { 
    this.dataEntry = <DataEntry>{}
    this.entryId = <EntryId>{}
    this.dataEntry.entryId = this.entryId
  }

  public setEntryIdName(name:string){
    this.dataEntry.entryId.name = name
  }

  public setOwnerUUID(uuid:string){
    this.dataEntry.entryId.ownerUUID = uuid
  }

  public setEntryIdType(type:string){
    this.dataEntry.entryId.type = type
  }

  public setURI(uri:string){
    this.dataEntry.entryId.URI = uri
  }

  public setDataEntry(values:{ [key: string]: any; }){
    this.dataEntry.values = values
  }

  public build(){
    return this.dataEntry
  }
}
