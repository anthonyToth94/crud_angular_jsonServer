import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lekerdezes',
  templateUrl: './lekerdezes.component.html',
  styleUrls: ['./lekerdezes.component.css']
})
export class LekerdezesComponent implements OnInit, OnChanges {

  passzoltErtek : boolean = false;
  passzoltObject : any;

  parentFunction(booleanErtek : any)
  {
    this.passzoltErtek = booleanErtek;
    console.log("parentFunction: " + booleanErtek);
  }

  ngOnInit(): void {
      
  }
  ngOnChanges(changes: SimpleChanges): void {
      console.log("changes: " + changes);
  }

  parentFunction2(object : any)
  {
    this.passzoltObject = object;
  }

}



