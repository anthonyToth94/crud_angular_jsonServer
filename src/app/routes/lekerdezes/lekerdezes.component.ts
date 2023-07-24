import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { IBeosztas } from 'src/app/models/beosztas.model';

@Component({
  selector: 'app-lekerdezes',
  templateUrl: './lekerdezes.component.html',
  styleUrls: ['./lekerdezes.component.css']
})
export class LekerdezesComponent implements OnInit {

  passzoltErtek : any;
  passzoltObject : IBeosztas[] = [];

  parentFunction(booleanErtek : any)
  {
    this.passzoltErtek = booleanErtek;
    console.log("LEKERDEZÉSBE RAKOM: " + booleanErtek);
  }

  ngOnInit(): void {
    console.log("MIVAN má");
    console.log(this.passzoltObject);

  }

  //Átadom a tömböt a Selecthez
  parentFunction2(object : IBeosztas[] = [])
  {
    this.passzoltObject = object;
  }

}



