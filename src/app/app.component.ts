import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'crudBasic';

  //Adatok
  adatok : any[] = [];

  //Változók
  //Hozzáad / Frissites gomb változtatása
  frissitesGomb :boolean = false;
  
  //Beérkező adatok inputokbol
  titleInput: string = "";
  userIdinput: number | undefined;

  //Frissitendő Index
  valtoztatIndex : any;

  //http Ezzel éred el a komponensben (de nem kell külön kiírni)
  constructor(private http: HttpClient) {
    //this.http = http;
  }

  ngOnInit(): void {
    this.lekredezes().subscribe();
  }

  //Fuggvenyek
  lekredezes(): Observable<any[]> {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(
        tap((json) => {
          console.log(json);
          this.adatok = json;
        })
      );
  }
  
  hozzadEvent() {
    const adatok = {
      title: this.titleInput,
      userId: this.userIdinput
    };
  
    this.http.post<any>('https://jsonplaceholder.typicode.com/posts', adatok)
      .pipe(
        tap((response) => {
          console.log(response);
          this.titleInput = "";
          this.userIdinput = undefined;
        })
      )
      .subscribe();
  }

  torlesEvent(event: number) {
    this.http.delete<any>('https://fakestoreapi.com/products/' + event)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }
  
  valtoztatEvent(event : number)
  {
    this.titleInput = this.adatok[event].name;
    this.userIdinput = this.adatok[event].age;

    this.valtoztatIndex = event;

    this.frissitesGomb = true;
  }

  frissitesEvent() {
    const adatok = {
      id: this.valtoztatIndex,
      title: this.titleInput,
      userId: this.userIdinput
    };
  
    this.http.put<any>('https://jsonplaceholder.typicode.com/posts/' + this.valtoztatIndex, adatok)
      .pipe(
        tap(() =>{
          this.titleInput = "";
          this.userIdinput = undefined;
          this.frissitesGomb = false;
        }))
      .subscribe(
        (e) => {
          console.error(e);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}