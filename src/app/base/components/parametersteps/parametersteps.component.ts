import { Parameter } from './../../../jaqpot-client/model/parameter';
import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-parametersteps',
  templateUrl: './parametersteps.component.html',
  styleUrls: ['./parametersteps.component.scss']
})
export class ParameterstepsComponent implements OnInit {
  @Input() parameters: Array<Parameter>;
  parametersFormGroup: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

}
