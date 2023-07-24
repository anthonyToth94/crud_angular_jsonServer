import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { IBeosztas } from '../models/beosztas.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersURL = 'http://localhost:3000/users'; // JSON szerver URL-je
  private beosztasURL = 'http://localhost:3000/beosztas';

  constructor(private http: HttpClient) { }

  //
  private _refreshRequired = new Subject<void>();
  get RefreshRequired(){
    return this._refreshRequired;
  }

  getBeosztas(): Observable<IBeosztas[]> {
    //Hibakezelést kihoztam a komponensből a servicebe, hogy ne kelljen mindenhol kezelni. 
    // Így a komponensben csak tap és feliratkozas marad.
    return this.http.get<IBeosztas[]>(this.beosztasURL).pipe(
      catchError(err => {
        return throwError(() => new Error(err.message));
      })
    );
  }

  //Http kérés, esemény, Adatbázis lekérdezés, Animáció/időzítés OBSERVABLE!
  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.usersURL);
  }

  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.usersURL, user).pipe(
      tap( () =>{
        this.RefreshRequired.next();
      }
    ));;
  }

  updateUser(id: number, user: UserModel): Observable<UserModel> {
    const url = `${this.usersURL}/${id}`;
    return this.http.put<UserModel>(url, user).pipe(
      tap( () =>{
        this.RefreshRequired.next();
      }
    ));
  }

  deleteUser(id: number): Observable<void> {
    const url = `${this.usersURL}/${id}`;
    return this.http.delete<void>(url);
  }

  getUserById(id: string): Observable<UserModel> {
    const url = `${this.usersURL}/${id}`;
    return this.http.get<UserModel>(url);
  }


}
