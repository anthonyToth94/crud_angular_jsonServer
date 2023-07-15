import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { map, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-tablazat',
  templateUrl: './tablazat.component.html',
  styleUrls: ['./tablazat.component.css']
})
export class TablazatComponent implements OnInit, OnChanges{

  szerkesztesForm: FormGroup;
  
  //Globális változók
  @Input() atvettErtek: any ;
  @Input() atvettObject: any;
  //Ide töltöm be az adatokat
  adatok : any[] = [];

  updateFormMegjelenese : boolean = false;

  //Ezt rakom bele a modosítasFormba
  modositasFormId : string = "";

  constructor(private formBuilder : FormBuilder, private userService : UserService){
    this.szerkesztesForm = this.formBuilder.group({
      id:[''],
      keresztnev: ['', this.nameValidator],
      lastName: ['', this.nameValidator],
      age: [''],
      email: ['', [Validators.required, Validators.email]],
      gender: [''], 
      position: ["Designer", Validators.required], 
      
      //Belső Group valamiért nem működik --- HELP ???? -
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required]],

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

  ngOnInit(): void {
    this.lekredezes();
  }

  //Frissítene, ha müködne minden alkalommal 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['atvettErtek'] && changes['atvettErtek'].currentValue == false) {
      this.lekredezes();
      this.atvettErtek = false;
    }
  }

  //Függvény select optiont elemei 
  findAtvettObject( value : string) : any{
     return this.atvettObject.find((item: { value: string, label: string }) => item.value === value);
  }


   //Fuggvenyek -- TÁBLÁZATHOZ --
   lekredezes(): void {
    this.userService.getUsers()
      .pipe(
        tap((adatok) => {
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

  szerkesztesEvent(id : number){
    this.userService.getUserById(id).pipe( 
      map(() => {
      const foundUser = this.adatok.find((user) => user.id === id);
      //conditional expression ha van user dobja be azt
      return foundUser ? foundUser : null;
    }
      )
    ).subscribe(
      (response) => {
        //Futási időben adatot változtat
        const position = this.findAtvettObject(response.beosztas);
        //Modosítsa (loopoja bele a responset) és positiont
        this.szerkesztesForm.patchValue({...response,position: position.value});
        this.modositasFormId = response.id;
        this.updateFormMegjelenese = true;
      },
      (error) => {
        console.error(error);
      }
    );
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
      this.lekredezes();
      this.szerkesztesForm.reset();
      console.log('Felhasználó sikeresen módosítva:', response);
      this.updateFormMegjelenese = false;
    },
    (error) => {
      console.error('Hiba történt a felhasználó hozzáadása során:', error);
    });
  }


 
}

