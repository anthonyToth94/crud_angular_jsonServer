import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription, tap } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { v4 as uuidv4, validate } from 'uuid';
import { IBeosztas } from 'src/app/models/beosztas.model';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-urlap',
  templateUrl: './urlap.component.html',
  styleUrls: ['./urlap.component.css']
})

export class UrlapComponent implements OnInit, OnDestroy {
  
  //Globális adatok
  urlapForm  : FormGroup;
  subscriptions: Subscription[] = [];
  //select option elemei HTML -hez
  @Output() beosztasKuldese: EventEmitter<IBeosztas[]> = new EventEmitter();
  beosztas: IBeosztas[] = [];
  
  //tablazatnak
  @Output() passzoltErtek : EventEmitter<boolean> = new EventEmitter<boolean>();
  frissites : any = false;

  formErrorMessage: boolean = false;

  //Konstruktór kezdő adatok tápálása (példányosítás, osztályváltozó inicializálás), inicializálunk oninitben meg futtatjuk a dolgokat
  constructor (private http: HttpClient, private formBuilder : FormBuilder, private userService : UserService){ 


  //FormBuilder összerakja láthatóbbá a formGroupokat és itt validáljuk
    this.urlapForm = this.formBuilder.group({
      firstName: ['', CustomValidators.nameValidator],
      lastName: ['', CustomValidators.nameValidator],
      age: ['', CustomValidators.rangeValidator(18, 100)],
      email: ['', [Validators.required, Validators.email], CustomValidators.emailTakenValidator(this.http)],
      gender: [''], 
      position: ["Designer", Validators.required], 
      
      //Belső Group valamiért nem működik --- HELP ???? -
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, CustomValidators.rangeValidator(1000, 9999)]],

      skills: this.formBuilder.array([]),

      isAccepted: [false, Validators.requiredTrue],
    });
  }
  
  

  //Életcikusa: Komponens inicializálásánál jön létre és egyből lefut osztály példányosítás után lép életbe nem ugy mint a consturctor
  ngOnInit() : void {
    //Eseményváltozás
    this.urlapForm.valueChanges.subscribe( (val) =>{
     console.log(val);
    })

    //Adatok lekérése db.jsonből -> select option -ba dinamikusan
    this.getBeosztas();
    
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach( sub => sub.unsubscribe());
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
    this.subscriptions.push(this.userService.getBeosztas()
        .pipe(
          tap((adatok: IBeosztas[]) => {
            this.beosztas = adatok;
          })
        ).subscribe( (response) => {
          this.beosztasKuldese.emit(this.beosztas);
          // console.log(response);
        })
    );
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
        this.frissites = true;

        //Átadom az értéket az anyának és onnan bele a táblázatba
        this.passzoltErtek.emit(this.frissites);

        console.log(this.frissites +" Első pont");
        //resetelek mindent alapértelmezettre
        this.urlapForm.reset();
        //Törölni az adatok a skills tömbből
        this.skills.clear();
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


  