import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersURL = 'http://localhost:3000/users'; // JSON szerver URL-je
  private beosztasURL = 'http://localhost:3000/beosztas';

  constructor(private http: HttpClient) { }

  getBeosztas(){
    return this.http.get(this.beosztasURL);
  }

  //Http kérés, esemény, Adatbázis lekérdezés, Animáció/időzítés OBSERVABLE!
  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.usersURL);
  }

  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.usersURL, user);
  }

  updateUser(id: number, user: UserModel): Observable<UserModel> {
    const url = `${this.usersURL}/${id}`;
    return this.http.put<UserModel>(url, user);
  }

  deleteUser(id: number): Observable<void> {
    const url = `${this.usersURL}/${id}`;
    return this.http.delete<void>(url);
  }

  getUserById(id: number): Observable<UserModel> {
    const url = `${this.usersURL}/${id}`;
    return this.http.get<UserModel>(url);
  }


}
