import { Injectable } from '@angular/core';
import { MetaInfo } from './../model/metaInfo';

@Injectable({
  providedIn: 'root'
})
export class MetaBuilderService {

  public metaInfo:MetaInfo

  constructor() { 
    this.metaInfo = <MetaInfo>{}
  }

  public setTitles(title:string){
    let titles = []
    this.metaInfo.titles.push(title)
  }

  public initilizeTitles(){
    this.metaInfo.titles = []
  }

  public initializeDescriptions(){
    this.metaInfo.descriptions = []
  }

  public initializeAudiences(){
    this.metaInfo.audiences = []
  }

  public initializeComments(){
    this.metaInfo.comments = []
  }

  public initializeTags(){
    this.metaInfo.tags = []
  }

  public initializeSubjects(){
    this.metaInfo.subjects = []
  }

  public setCreators(creator:string){
    let creators = []
    creators.push(creator)
    this.metaInfo.creators = creators
  }

  public setAudiences(audiences:string){
    let _audiences = []
    _audiences.push(audiences)
    this.metaInfo.audiences = _audiences
  }

  public setComments(comment:string){
    let _comments = []
    _comments.push(comment)
    this.metaInfo.comments = _comments
  }

  public setContributtors(contributors:string)
  {
    let _contributors = []
    _contributors.push(contributors)
    this.metaInfo.contributors = _contributors
  }

  public setDescriptions(description:string){
    let _descriptions = []
    _descriptions.push(description)
    this.metaInfo.descriptions = _descriptions
  }

  public setTags(tag:string){
    let _tag = []
    _tag.push(tag)
    this.metaInfo.tags = _tag
  }

  public build(){
    return this.metaInfo
  }

}
