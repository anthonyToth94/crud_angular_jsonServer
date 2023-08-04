import { Component, OnDestroy, OnInit } from '@angular/core';

//Kiegészítők
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

//Services components
import { utilityFunctions } from '../../utilities/utilityFunctions';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';


/*
import { ToastrService } from 'ngx-toastr';  
*/

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

//inicializáláskor felvesszük az értékeket, és megszüntetjük a végén azokat
export class SignupComponent implements OnInit, OnDestroy {

  //Globális változók

  //Form
  signup: FormGroup | any;

  //Rxjsből fejlegyzem a feliratkozásokat
  subscriptions: Subscription[] = [];

  //Dinamikusan változó ERROR MESSAGE | Sikeres regisztráció / Ilyen felhasználónév már van
  errorMessage: string = "";

  //Jelszó mutatása HTML-ben ikonra kattintva
  showPassword: boolean = false;

  constructor(private _route: Router, private _formBuilder: FormBuilder, private _http: HttpClient, private _userService: UserService) {
    this.signup = this._formBuilder.group({
      'username': new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9]+$/) //Csak betűk és számjegyek engedélyezettek
      ]),
      'password': new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        utilityFunctions.passwordStrengthValidator() //Kis és nagybetű és legyenek benne számok
      ]
      ),
      'password2': new FormControl("",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          utilityFunctions.passwordStrengthValidator() //Kis és nagybetű és legyenek benne számok
        ])
    });
  }

  //Inicializáláskor létrehozott értékek
  ngOnInit(): void {
    //Eseményváltozásnál figyelem és feliratkozok
    this.signup.valueChanges.subscribe((val: any) => {
      console.log(val);
    })
  }

  //Subscriptionok leiratkozása
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  //Bejelentkezés
  signupSubmit(signup: FormGroup): void {
    //Jelszó és inputok vizsgálata
    if (!this.validFormAndPassword(signup)) {
      return; //Ha sikertelen, akkor ide fut bele
    }

    //Ha sikeres innen folytatódik
    const newUser: UserModel = {
      id: uuidv4(),
      username: this.signup.value.username,
      password: this.signup.value.password,
    };

    //Hozzáadom a subscriptionhoz, kikérem a Felhasználónevet és ha nincs ilyen hozzáadom
    this.subscriptions.push(
      this._userService.getUserByUsername(newUser.username)
        .subscribe(
          (resp) => {
            if (Array.isArray(resp) && resp.length === 0) {
              this.subscriptions.push(
                this._userService.addUser(newUser).subscribe(
                  (addedUser) => {
                    // Az új felhasználó hozzáadása sikeres volt, itt kezelheted további lépéseket
                    this.setErrorMessage("Sikeres regisztráció!");
                    this.signup.reset();
                  },
                  (error) => {
                    console.error("Hiba történt az új felhasználó hozzáadása közben:", error);
                  }
                ));
            } else {
              this.setErrorMessage("Ez a felhasználónév foglalt!");
            }
          }, (error) => {
            // Valami hiba (pl. hálózati hiba)
            console.error("Hiba történt a kérés során.", error);
            this.signup.reset();
          }
        ));
  }

  //Levizsgálni az azonos jelszót és hogy valid a form összes mezője vagy nem
  validFormAndPassword(signup: FormGroup) {
    if (signup.value.password != signup.value.password2) {
      this.setErrorMessage('Hiba történt, mert nem egyeznek a jelszavak.');
      return false;
    }

    //Ha minden valid, csak akkor engedje létrehozni
    if (!this.signup.valid) {
      this.setErrorMessage("Töltse ki az összes mezőt helyesen!");
      return false;
    }
    return true;
  }

  //Függvénybe helyezni külön az ugyan azon diven ismétlődő errorMessaget  
  setErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000); // 3 másodperc után törli az üzenetet
  }

  //Jelszót mutassa vagy ne
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  //Előre megírt error kezelő függvény
  getError(path: string, errorName: string) {
    const formControl = (this.signup.get(path) as FormControl);
    if (formControl.untouched && formControl.pristine) {
      return;
    }
    return formControl.errors?.[errorName];
  }

}
