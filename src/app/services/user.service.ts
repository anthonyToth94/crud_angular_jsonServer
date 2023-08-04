import { Injectable } from '@angular/core';

//Kiegészítők
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

//Models
import { UserModel, LoginData } from '../models/user.model';
import { RoleModel } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // JSON szerver URL-je
  private usersURL = 'http://localhost:3000/users';
  private calendarsURL = 'http://localhost:3000/calendars';
  private rolesURL = 'http://localhost:3000/roles';

  constructor(private http: HttpClient) { }

  //Frissítés miatt
  private _refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this._refreshRequired;
  }

  //Regisztráció
  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.usersURL, user);
  }

  //Regisztrációnál összehasonlítani, hogy van-e már ilyen user
  getUserByUsername(username: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.usersURL}?username=${username}`);
  }

  //Bejelentkezés
  getUserByUsernameAndPassword(loginData: LoginData): Observable<UserModel> {
    return this.http.get<UserModel[]>(`${this.usersURL}?username=${loginData.username}&password=${loginData.password}`)
      .pipe(
        map(users => users[0]) //A válaszból az első elemet kikérem
      );
  }

  //Töltse be a profilehoz tartozó a beosztást-t (Legyen kiírva ez alapján)
  getUserRoleName(roleId: string): Observable<string> {
    return this.http.get<any[]>(this.rolesURL) // Az any[] megadása fontos a típusbiztonság miatt
      .pipe(
        map(roles => {
          //Nézze végig az összes elemet és keresse meg azt azid-t ami matchel az enyémmel, majd mentse el azt a rolet és adja vissza az namet
          const role = roles.find(r => r.id === roleId);
          if (role) {
            return role.name;
          }
          return 'Jelenleg nincs beosztása';
        })
      );
  }

  //Formnak szükséges, hogy dinamikusan rakjuk bele az adatot
  getRoles(): Observable<RoleModel[]> {
    //Hibakezelést kihoztam a komponensből a servicebe, hogy ne kelljen mindenhol kezelni. 
    // Így a komponensben csak tap és feliratkozas marad.
    return this.http.get<RoleModel[]>(this.rolesURL).pipe(
      catchError(err => {
        return throwError(() => new Error(err.message));
      })
    );
  }

  //Módosítani a beosztást
  updateUserRole(userId: string, newRoleId: RoleModel): Observable<UserModel> {
    const url = `${this.usersURL}/${userId}`;
    const patchData = { roleId: newRoleId };
    return this.http.patch<UserModel>(url, patchData).pipe(
      tap(() => {
        this.RefreshRequired.next();
      }
      ));
  }
}
