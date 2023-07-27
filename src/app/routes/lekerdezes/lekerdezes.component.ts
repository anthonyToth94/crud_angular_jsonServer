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

  //Beosztásom Táblázatba -> Inputbol
  passzoltObject : IBeosztas[] = [];


  //Táblázatból érkező adat -> Urlapba küldöm tovább
  modositaniKivantUser : any;
  ///Táblázatból érkező adat -> Urlapba küldöm tovább | Ezzel változik modosítok / hozzáadok
  booleanUpdateForm : boolean = false;

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

  //Táblázatból kiküldöm -> Modosítani kívánt 1 Elem
  modositastAtveszemFunction(object : any)
  {
    this.modositaniKivantUser = object;
  }

  //Tablazatból kiküldöm -> miután rányomtak a Szerkesztésre  
  booleanUpdateFormnakFunction(object : boolean)
  {
    this.booleanUpdateForm = object;  //True
  }

  //Ürlapból visszaküldöm a False értéket modosítás után, hogy felülírjam a Táblázatban
  visszaKuldBooleanUpdateEvent(object : boolean)
  {
    this.booleanUpdateForm = object;
  }

}



