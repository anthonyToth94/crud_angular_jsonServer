import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private baseUrl = 'http://localhost:3000/users'; // JSON szerver URL-je

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.baseUrl);
  }

  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.baseUrl, user);
  }

  updateUser(id: number, user: UserModel): Observable<UserModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<UserModel>(url, user);
  }

  deleteUser(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  getUserById(id: number): Observable<UserModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<UserModel>(url);
  }
}