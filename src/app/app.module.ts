import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Fontos: Itt importáljuk a RouterModule-t!
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KezdolapComponent } from './routes/kezdolap/kezdolap.component';
import { NemTalalhatoComponent } from './routes/nem-talalhato/nem-talalhato.component';
import { UrlapComponent } from './components/urlap/urlap.component';
import { TablazatComponent } from './components/tablazat/tablazat.component';
import { LekerdezesComponent } from './routes/lekerdezes/lekerdezes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FrissitesComponent } from './components/frissites/frissites.component';

@NgModule({
  declarations: [
    AppComponent,
    KezdolapComponent,
    NemTalalhatoComponent,
    UrlapComponent,
    TablazatComponent,
    LekerdezesComponent,
    FrissitesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
