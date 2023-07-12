import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-kivalaszt',
  templateUrl: './kivalaszt.component.html',
  styleUrls: ['./kivalaszt.component.css']
})
export class KivalasztComponent implements OnInit{

  adatok : any = [];
  adatId = "";
  //route;           paraméterek kinyerése                              ezzel navigálunk át 
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router){
    // this.route = route;
  }

  ngOnInit() : void{
    //Kikérjük a paramétert az urlből 
    this.route.params.subscribe( (params : any) =>{
      this.adatId = params.id;
      return this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos?albumId=' + params.id)
      .pipe(
        tap((adatok) => {
          //Ha üres tömb jön be (random beírunk az urlbe egy számot, ami nem létezik)
          if(adatok.length === 0)
          {
            console.log("Nincs találat");
            this.router.navigate(["/lekerdezes"]);
            return;
          }
         this.adatok = adatok;
        })
      ).subscribe( (kiir) =>
          console.log(kiir) );
    });
  }

  //GET https://jsonplaceholder.typicode.com/photos?albumId=?

}

