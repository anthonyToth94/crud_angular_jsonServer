import { HttpClient } from '@angular/common/http';
import { AsyncValidatorFn, ValidatorFn, Validators } from '@angular/forms';
import { catchError, delay, map, of, switchMap } from 'rxjs';

export class CustomValidators {
  static nameValidator = Validators.compose([  //static szó jelentése, nem kell létrehoznunk egy osztály példányt
    Validators.required,              //Közvetlenül az osztályhoz vannak rendelve, nem pedig az osztály példányaihoz.
    Validators.minLength(0),         //static nélkül már const nV = new CustomValidators();
    Validators.maxLength(20)
  ]);
 
  //Egyedi validátor Szinkron
  static rangeValidator(min: number, max: number): ValidatorFn{
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

   //Egyedi validátor Aszinkron
  static emailTakenValidator(http:HttpClient) : AsyncValidatorFn{
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
}

