import { Component, OnInit } from '@angular/core';

//Kiegészítők
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription, catchError, map, tap } from 'rxjs';

//Services components
import { UserModel } from '../../models/user.model';
import { LoginData } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AuthserviceService } from '../../services/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //Form és elmenteni a usert
  login: FormGroup | any;


  //felirakozás, hogy megszüntessem a destroyban
  subscriptions: Subscription[] = [];

  //Dinamikusan változó ERROR MESSAGE | Sikeres regisztráció / Ilyen felhasználónév már van
  errorMessage: string = "";


  constructor(private _route: Router, private _formBuilder: FormBuilder, private _userService: UserService, private _authService: AuthserviceService) {
    this.login = this._formBuilder.group({
      'username': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {
    //Eseményváltozásnál figyelem és feliratkozok
    this.login.valueChanges.subscribe((val: any) => {
      console.log(val);
    })
  }

  //Subscriptionok leiratkozása
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  logindata(loginForm: FormGroup) {
    //Ha ki van töltve mind, akkor jó
    if (!this.login.valid) {
      this.setErrorMessage("Töltse ki az összes mezőt helyesen!");
      return;
    }

    //Ha sikeres innen folytatódik
    const loginUser: LoginData = {
      username: loginForm.value.username,
      password: loginForm.value.password,
    };

    //Hozzáadom a subscriptionhoz, kikérem a Felhasználónevet és ha nincs ilyen hozzáadom
    this.subscriptions.push(
      this._userService.getUserByUsernameAndPassword(loginUser)
        .subscribe((user: UserModel) => {
          if (user && user.id) {

            //Autentikáció végzése
            this._authService.login(user);
            //Átirányítás
            this._route.navigate(['kezdolap']);
          } else {
            this.setErrorMessage("Hibás felhasználónév vagy jelszó");
          }
        }));
  }


  //Függvénybe helyezni külön az ugyan azon diven ismétlődő errorMessaget  
  setErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000); // 3 másodperc után törli az üzenetet
  }

  //Előre megírt error kezelő függvény
  getError(path: string, errorName: string) {
    const formControl = (this.login.get(path) as FormControl);
    if (formControl.untouched && formControl.pristine) {
      return;
    }
    return formControl.errors?.[errorName];
  }
}
