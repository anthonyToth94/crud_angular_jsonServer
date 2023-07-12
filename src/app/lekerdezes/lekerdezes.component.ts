import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-lekerdezes',
  templateUrl: './lekerdezes.component.html',
  styleUrls: ['./lekerdezes.component.css']
})
export class LekerdezesComponent implements OnInit{
  title = 'crudBasic';

  //Adatok
  adatok : any[] = [];

  //Változók
  //Hozzáad / Frissites gomb változtatása
  frissitesGomb :boolean = false;
  idMezoKikapcsolasa = false;

  //Beérkező adatok inputokbol
  nameInput: string = "";
  idInput: number | undefined;

  //Frissitendő Index
  //valtoztatIndex : any; ez már nem kell

  //http Ezzel éred el a komponensben (de nem kell külön kiírni)
  constructor(private userService: UserService) {
    //this.http = http;
  }

  ngOnInit(): void {
    this.lekredezes();
  }

  //Fuggvenyek
  lekredezes(): void {
    this.userService.getUsers()
      .pipe(
        tap((json) => {
          console.log(json);
          this.adatok = json;
        })
      ).subscribe( (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      });
  }
  
  hozzadEvent() {
    const adatok: UserModel = {
      id: this.idInput,
      name: this.nameInput
    };
  
   this.userService.addUser(adatok)
      .pipe(
        tap((response) => {
          console.log(response);
          this.nameInput = "";
          this.idInput = undefined;
          this.lekredezes();
        })
      )
      .subscribe( (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      });
  }

  torlesEvent(event: number) {
    this.userService.deleteUser(event)
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
  
  valtoztatEvent(event : number)
  {
    this.userService.getUserById(event)
    .subscribe(
      (user: UserModel) => {
        this.nameInput = user.name;
        this.idInput = user.id;
        this.frissitesGomb = true;
        this.idMezoKikapcsolasa = true;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  frissitesEvent() : void {
    const updatedUser: UserModel = {
      id: this.idInput,
      name: this.nameInput
    };
    //@ts-ignore
    this.userService.updateUser(updatedUser.id, updatedUser)
    .pipe(
      tap(() => {
        // Töltsd újra az adatokat a frissítés után
        this.lekredezes();
        this.nameInput = "";
        this.idInput = undefined;
        this.frissitesGomb = false;
        this.idMezoKikapcsolasa = false;
      })
    )
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