import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

import { Validators } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { map } from 'rxjs';
import { IBeosztas } from 'src/app/models/beosztas.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-frissites',
  templateUrl: './frissites.component.html',
  styleUrls: ['./frissites.component.css']
})
export class FrissitesComponent implements OnChanges{

  //Globális változó
  szerkesztesForm: FormGroup;
  @Input() 
  atvettObject: any;

  @Input() 
  idFromTablazat: string | undefined ;

  @Input()
  selectFromTablazat: IBeosztas[] = [];
  @Input() 
  userFromTablazat : any;

  @Input()
  triggerFromTablazat : boolean = false;
  @Output() isEditableChange = new EventEmitter<boolean>();
  
  constructor(private formBuilder : FormBuilder, private userService : UserService){
    this.szerkesztesForm = this.formBuilder.group({
      id:[''],
      keresztnev: ['', CustomValidators.nameValidator],
      email: ['', [Validators.required, Validators.email]],
      position: ["", Validators.required], 

    });
  }

  // Az ngOnChanges metódus lefut, amikor a @Input érték változik
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.szerkesztesForm);
      // Ha az @Input érték változik és nem null vagy undefined, akkor frissítsd a form értékét
      this.szerkesztesForm.patchValue({
        id: this.userFromTablazat.id,
        keresztnev: this.userFromTablazat.keresztnev,
        email: this.userFromTablazat.email,
        position: this.userFromTablazat.beosztas
      });
  }
   //Függvény select optiont elemei 
   findAtvettObject( value : string) : any{
    return this.atvettObject.find((item: { value: string, label: string }) => item.value === value);
 }
 
  //Fuggvenyek -- FORMHOZ --
  modositasForm(){
    const updatedUser: UserModel = {
      id: this.szerkesztesForm.value.id,
      keresztnev: this.szerkesztesForm.value.keresztnev,
      vezeteknev: this.szerkesztesForm.value.lastName,
      eletkor: this.szerkesztesForm.value.age,
      email: this.szerkesztesForm.value.email,
      beosztas: this.szerkesztesForm.value.position,
      nem: this.szerkesztesForm.value.gender,
      utca: this.szerkesztesForm.value.street,
      varos: this.szerkesztesForm.value.city,
      iranyitoszam: this.szerkesztesForm.value.zip,
      keszsegek: this.szerkesztesForm.value.skills
    };

    console.log(updatedUser);
    this.userService.updateUser(this.szerkesztesForm.value.id, updatedUser)
    .subscribe((response) => {
      this.triggerFromTablazat = false;
      this.isEditableChange.emit(this.triggerFromTablazat);
      this.szerkesztesForm.reset();
      console.log('Felhasználó sikeresen módosítva:', response);
    },
    (error) => {
      console.error('Hiba történt a felhasználó hozzáadása során:', error);
    });
  }

}
