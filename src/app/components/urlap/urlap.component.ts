import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription, tap } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { IBeosztas } from 'src/app/models/beosztas.model';
import { CustomValidators } from '../../validators/custom-validators';
import { Router } from '@angular/router';


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
  
  //Form validáció
  formErrorMessage: boolean = false;

  //Készségekhez
  keszsegekErrorMessage:boolean = false;

  //Modosítani kívánt <- Fogadom a Táblázatból (Ezt töltöm a formba bele)
  @Input()
  modositasraVaro : any;

  //Ezt fogadom, hogy Modosítás van és nem Hozzáadás, majd vissza is küldöm, ha történt módosítás 
  @Output() visszaKuldBooleanUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() booleanUpdate : boolean = false;

  //Konstruktór kezdő adatok tápálása (példányosítás, osztályváltozó inicializálás), inicializálunk oninitben meg futtatjuk a dolgokat
  constructor (private http: HttpClient, private formBuilder : FormBuilder, private userService : UserService, private router: Router){ 

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
  
  ngOnChanges(changes: SimpleChanges): void {
    //id, keresztnev,vezeteknev, eletkor, email, beosztas, nem,utca, varos, iranyitoszam  
    // Ha az @Input érték változik és nem null vagy undefined, akkor frissítsd a form értékét

    this.urlapForm.patchValue({
      //id: this.urlapForm.id,
      firstName: this.modositasraVaro.keresztnev,
      lastName: this.modositasraVaro.vezeteknev,
      age: this.modositasraVaro.eletkor, 
      email: this.modositasraVaro.email,
      gender: this.modositasraVaro.nem, 
      position: this.modositasraVaro?.beosztas ? this.modositasraVaro.beosztas : 'Designer',
      
      //Belső Group valamiért nem működik --- HELP ???? -
      street: this.modositasraVaro.utca,
      city: this.modositasraVaro.varos, 
      zip: this.modositasraVaro.iranyitoszam,

      isAccepted: false,
    });

    //Feltöltöm az urlapFormban a skills elemeit, de előtte kitörlöm, ami benne van
    this.skills.clear();
    if (this.modositasraVaro && this.modositasraVaro.keszsegek) {
      this.modositasraVaro.keszsegek.forEach((keszseg: string) => {
        this.skills.push(new FormControl(keszseg));
      });
    }

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
    if(inputField.value == "")
    {
        this.keszsegekErrorMessage = true;
        return;
    }
    this.skills.push(
      new FormControl(inputField.value)
    )
    inputField.value = "";
    console.log(this.urlapForm.value);
    this.keszsegekErrorMessage = false;
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

  onSubmit(): void {
    console.log(this.urlapForm.controls);
    console.log(this.urlapForm);


     //Ha minden valid, csak akkor engedje létrehozni
     if (!this.urlapForm.valid) {
      this.formErrorMessage = true;
      return;
    }// Ezt vedd ki esetleg tesztelni a hozzáadásokat

    this.formErrorMessage = false;
    /*
    this.urlapForm.patchValue({ isAccepted: true });
    console.log(this.urlapForm.value.isAccepted);
    */
    console.log(this.booleanUpdate + "Ez jon a tablazatbol ezzel vizsgalom a modositast vagy addusert");

    if (this.booleanUpdate) {
      this.modositasForm();
    } else {
      this.addUserEvent();
    }

    
  }

  addUserEvent() : void{
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
        this.booleanUpdate = true;

        //Átadom az értéket az anyának és onnan bele a táblázatba
        this.visszaKuldBooleanUpdate.emit(this.booleanUpdate);

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
  
  modositasForm(){
    const updatedUser: UserModel = {
      id: this.modositasraVaro.id,
      keresztnev: this.urlapForm.value.firstName,
      vezeteknev: this.urlapForm.value.lastName,
      eletkor: this.urlapForm.value.age,
      email: this.urlapForm.value.email,
      beosztas: this.urlapForm.value.position,
      nem: this.urlapForm.value.gender,
      utca: this.urlapForm.value.street,
      varos: this.urlapForm.value.city,
      iranyitoszam: this.urlapForm.value.zip,
      keszsegek: this.urlapForm.value.skills,
      };


    this.userService.updateUser(this.modositasraVaro.id, updatedUser)
    .subscribe((response) => {
      this.formErrorMessage = false;

      this.booleanUpdate = false;
      this.visszaKuldBooleanUpdate.emit(this.booleanUpdate);
      //Törölni az adatok a skills tömbből
      this.skills.clear();

      //Kitörlöm az adatokat
      this.modositasraVaro = {};
      //Resetelem az urlapot
      this.urlapForm.reset(); 
      //Futás időben kifejezetten 1 elemet frissít Ez itt nem fut le, mert az onChanges valoszinu felülirja
      //this.urlapForm.patchValue({ position: 'Designer' })
      console.log('Felhasználó sikeresen módosítva:', response);

      //Itt kellene visszaküldeni egy értéket, hogy állítsa visszaa boolean update

    },
    (error) => {
      console.error('Hiba történt a felhasználó módosítása során:', error);
    });
  }

  reloadPage() : void 
  {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
  }
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate(['/lekerdez']);
  }
}


  