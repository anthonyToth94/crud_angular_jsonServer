import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lekerdezes',
  templateUrl: './lekerdezes.component.html',
  styleUrls: ['./lekerdezes.component.css']
})
export class LekerdezesComponent{

  passzoltErtek : boolean = false;
  passzoltObject : any;

  parentFunction(booleanErtek : any)
  {
    this.passzoltErtek = booleanErtek;
  }

  parentFunction2(object : any)
  {
    this.passzoltObject = object;
  }

}



