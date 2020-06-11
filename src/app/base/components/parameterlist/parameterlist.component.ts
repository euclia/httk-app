import { MaterialModule } from './../../../material/material.module';
import { Parameter } from './../../../jaqpot-client/model/parameter';
import { Component, OnInit,Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-parameterlist',
  templateUrl: './parameterlist.component.html',
  styleUrls: ['./parameterlist.component.scss']
})
export class ParameterlistComponent implements OnInit {
  @Input() parameters: Array<Parameter>;
  constructor() { }

  ngOnInit(): void {
  }

}
