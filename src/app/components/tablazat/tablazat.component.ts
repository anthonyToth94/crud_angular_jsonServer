import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { map, tap } from 'rxjs';
import { IBeosztas } from 'src/app/models/beosztas.model';
/*
import { Validators } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';
import { CustomValidators } from 'src/app/validators/custom-validators';
*/

@Component({
  selector: 'app-tablazat',
  templateUrl: './tablazat.component.html',
  styleUrls: ['./tablazat.component.css']
})
export class TablazatComponent implements OnInit{

  //szerkesztesForm: FormGroup;
  
  //Globális változók
  @Input() 
  atvettErtek: any ;

  //Select értékek 
  @Input()
  atvettObject: IBeosztas[] = [];

  //Ide töltöm be az adatokat
  adatok : any[] = [];

  modositasFormId : string | undefined;

  //Ezt rakom bele a modosítasFormba
  @Output() modositandoKuldese = new EventEmitter ();
  foundUser : any = {};

  //Ezzel modosítom, hogy Szerkesztés van-e vagy Hozzáadás
  @Output() booleanUpdateFormnak = new EventEmitter ();
  @Input() updateFormMegjelenese : boolean = false;

  constructor( private userService : UserService){
  
  }
  
  ngOnInit(): void {
    this.lekredezes();
    this.userService.RefreshRequired.subscribe( (resp) =>{
      this.lekredezes();
    });
  }

  //BooleanUpdateFormot felülírom a kapott értékkel
  onEditModeChange(isEditable: boolean) {
    console.log("Vissza írom a booleant, hogy tudjak modosítani ismét");
    this.updateFormMegjelenese = isEditable;
  }

   //Fuggvenyek -- TÁBLÁZATHOZ --
   lekredezes(): void {
    console.log("lekredezes")
    this.userService.getUsers()
      .pipe(
        tap((adatok) => {
          console.log(adatok);
          this.adatok = adatok;
        })
      ).subscribe( (response) => {
        console.log(response);

      },
      (error) => {
        console.error(error);
      });
  }

  torlesUserEvent(id: any) : void
  {
    this.userService.deleteUser(id)
    .subscribe(
      (response) => {
        console.log(response);
        this.lekredezes();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //Form
  szerkesztesEvent(id : string){
    this.userService.getUserById(id).pipe( 
      map(() => {
      this.foundUser = this.adatok.find((user) => user.id === id);
      //conditional expression ha van user dobja be azt
      return this.foundUser ? this.foundUser : null;
    }
      )
    ).subscribe(
      (response) => {
        //Futási időben adatot változtat
        this.modositasFormId = response.id;
        this.booleanUpdateFormnak.emit(this.updateFormMegjelenese = true)
        this.modositandoKuldese.emit(this.foundUser);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  

 
}

