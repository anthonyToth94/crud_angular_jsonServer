import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private loggedInUser: any = null; // Itt tároljuk a bejelentkezett felhasználó adatait

  constructor() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.loggedInUser = JSON.parse(storedUser);
    }
  }

  //Ide az usert dobjuk csak bele
  login(user: any) {
    if (user) {
      // Bejelentkezési művelet
      this.loggedInUser = user;
      //Elmentem, hogy Frissítés után F5 nél is bent maradjon a sessionben
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
  }

  logout() {
    // Kijelentkezési művelet
    this.loggedInUser = null;
    //Kitörlöm a sessiont, ha kijelentkezek
    localStorage.removeItem('loggedInUser');
  }

  get isLoggedIn() {
    // Ellenőrizzük, hogy van-e bejelentkezett felhasználó
    return this.loggedInUser !== null;
  }

  get user() {
    // Visszaadjuk a bejelentkezett felhasználó adatait
    return this.loggedInUser;
  }
}
