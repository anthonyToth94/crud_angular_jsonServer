import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn,AsyncValidatorFn, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, of, switchMap, tap } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { v4 as uuidv4, validate } from 'uuid';

function rangeValidator(min: number, max: number): ValidatorFn{
  return ( (control) =>{
    //Ha nincs hiba
    if(control.value >= min && control.value <= max)
    {
      return null;
    }
    //Ha objektum
    return {
      range:{
        min: min,
        max: max,
        actual: control.value
      }
    }
  })
}

function emailTakenValidator(http:HttpClient) : AsyncValidatorFn{
  return (control) =>{
   return of(control.value).pipe(
    delay(500),
    switchMap(email => http.get("https://kodbazis.hu/api/is-email-taken",{
      params:{
        email: control.value
      }
    }).pipe(
      map( () => null),
      catchError( () => of({
        taken: true
      }))
    ))
   )
  }
}

@Component({
  selector: 'app-urlap',
  templateUrl: './urlap.component.html',
  styleUrls: ['./urlap.component.css']
})

export class UrlapComponent implements OnInit {
  
  //Globális adatok
  urlapForm  : FormGroup;

  //select option elemei HTML -hez
  @Output() beosztasKuldese : EventEmitter <{ value: string, label: string }[]> = new EventEmitter();
  beosztas: { value: string, label: string }[] = [];
  
  //tablazatnak
  @Output() passzoltErtek : EventEmitter<boolean> = new EventEmitter<boolean>();
  frissites : boolean = false;

  formErrorMessage: boolean = false;

  //Konstruktór kezdő adatok tápálása (példányosítás, osztályváltozó inicializálás), inicializálunk oninitben meg futtatjuk a dolgokat
  constructor (private http: HttpClient, private formBuilder : FormBuilder, private userService : UserService){ 

    
  //FormBuilder összerakja láthatóbbá a formGroupokat és itt validáljuk
    this.urlapForm = this.formBuilder.group({
      firstName: ['', this.nameValidator],
      lastName: ['', this.nameValidator],
      age: ['', rangeValidator(18, 100)],
      email: ['', [Validators.required, Validators.email], emailTakenValidator(this.http)],
      gender: [''], 
      position: ["Designer", Validators.required], 
      
      //Belső Group valamiért nem működik --- HELP ???? -
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, rangeValidator(1000, 9999)]],

      skills: this.formBuilder.array([]),

      isAccepted: [false, Validators.requiredTrue],
    });
  }
  
  //Ismétlődő validátorok
    nameValidator = Validators.compose([
      Validators.required,
      Validators.minLength(0),
      Validators.maxLength(20)
    ]);

  //Életcikusa: Komponens inicializálásánál jön létre és egyből lefut osztály példányosítás után lép életbe nem ugy mint a consturctor
  ngOnInit() : void {
    //Eseményváltozás
    this.urlapForm.valueChanges.subscribe( (val) =>{
     console.log(val);
    })

    //Adatok lekérése db.jsonből -> select option -ba dinamikusan
    this.getBeosztas();
    
  }


  //--- FORM ---
  //Errorok kezelése -> ngIf error divben true / false
  getError(path: string, errorName: string){
    const formControl = (this.urlapForm.get(path) as FormControl);
    if(formControl.untouched && formControl.pristine)
    {
      return;
    }
    return formControl.errors?.[errorName];
  }

  //Skills tömb FormGroupon belül
  get skills()
  {
    //Alakítsd át arrayre, hogy használhasd a pusht
    return this.urlapForm.get('skills') as FormArray;
  }

  addSkills(inputField: HTMLInputElement){
    this.skills.push(
      new FormControl(inputField.value)
    )
    inputField.value = "";
    console.log(this.urlapForm.value);
  }

  removeSkills(index: number)
  {
    this.skills.removeAt(index);
    console.log(this.urlapForm.value);
  }

  //-- CRUD ---
  getBeosztas(): void {
    this.userService.getBeosztas()
      .pipe(
        tap((adatok) => {
          this.beosztas = adatok as { value: string, label: string }[];
        })
      ).subscribe( (response) => {
        this.beosztasKuldese.emit(this.beosztas);
        console.log(response);
      },
      (error) => {
        console.error(error);
      });
  }

  addUserEvent() : void{
    //Ha minden valid, csak akkor engedje létrehozni
    if (!this.urlapForm.valid) {
      this.formErrorMessage = true;
      return;
    }// Ezt vedd ki esetleg tesztelni a hozzáadásokat

    //Kipipálva
    this.urlapForm.patchValue({isAccepted: true});

    const newUser: UserModel = {
      id: uuidv4(),
      keresztnev: this.urlapForm.value.firstName,
      vezeteknev: this.urlapForm.value.lastName,
      eletkor: this.urlapForm.value.age,
      email: this.urlapForm.value.email,
      beosztas: this.urlapForm.value.position,
      nem: this.urlapForm.value.gender,
      utca: this.urlapForm.value.street,
      varos: this.urlapForm.value.city,
      iranyitoszam: this.urlapForm.value.zip,
      keszsegek: this.urlapForm.value.skills
    };

    this.userService.addUser(newUser)
    .subscribe(
      (response) => {
        //Kiveszem a Kitöltés szükséges ...
        this.formErrorMessage = false;

        //Átadom az értéket az anyának és onnan bele a táblázatba
        this.passzoltErtek.emit(this.frissites = true);
        console.log(this.frissites);
        //resetelek mindent alapértelmezettre
        this.urlapForm.reset();
        //Futás időben kifejezetten 1 elemet frissít
        this.urlapForm.patchValue({ position: 'Designer' })

        console.log('Felhasználó sikeresen hozzáadva:', response);
      },
      (error) => {
        console.error('Hiba történt a felhasználó hozzáadása során:', error);
      }
    );
  }

}


  